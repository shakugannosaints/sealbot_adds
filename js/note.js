// ==UserScript==
// @name         笔记插件
// @description  .note/.gnote来记录笔记/群笔记
// @version      1.0.1
// @author       冷筱华
// @timestamp    2025-3-11
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

if (!seal.ext.find('note')) {
    const ext = seal.ext.new('note', '冷筱华', '1.0.1');
    
    // 配置项
    const defaultConfig = {
      maxNoteLength: 100,      // 单条笔记最大长度
      maxNotesCount: 100,      // 最大存储数量
      defaultShowCount: 5,     // 默认显示条数
      pageSize: 5              // 每页显示数量
    };
    
    // 分页缓存 { [key]: { page: number, notes: array } }
    const pageCache = new Map();
  
    // 指令定义
    const cmdNote = seal.ext.newCmdItemInfo();
    cmdNote.name = 'note';
    cmdNote.help = '个人笔记功能\n.note [内容] - 添加笔记\n.note [页码] - 查看指定页';
    
    const cmdGnote = seal.ext.newCmdItemInfo();
    cmdGnote.name = 'gnote';
    cmdGnote.help = '群组笔记功能\n.gnote [内容] - 添加群笔记\n.gnote [页码] - 查看指定页';
  
    // 通用处理函数
    const solveHandler = (isGroup) => (ctx, msg, cmdArgs) => {
      const senderId = msg.sender.userId;
      const groupId = ctx.group?.groupId || 'private';
      const keyPrefix = isGroup ? 'gnote' : 'note';
      const storageKey = `${keyPrefix}_${isGroup ? groupId : senderId}`;
      
      // 获取配置
      const config = { ...defaultConfig, ...ext.storageGet('config') };
      
      // 处理输入内容
      const inputText = cmdArgs.getArgN(1);
      const pageArg = parseInt(cmdArgs.getArgN(1));
  
      if (inputText && isNaN(pageArg)) {
        // 添加新笔记
        if (inputText.length > config.maxNoteLength) {
          return seal.replyToSender(ctx, msg, `笔记长度超过限制（最大${config.maxNoteLength}字）`);
        }
        
        const notes = JSON.parse(ext.storageGet(storageKey) || '[]');
        notes.unshift({
          content: inputText,
          timestamp: Date.now(),
          author: senderId
        });
        
        // 限制总数
        if (notes.length > config.maxNotesCount) {
          notes.length = config.maxNotesCount;
        }
        
        ext.storageSet(storageKey, JSON.stringify(notes));
        seal.replyToSender(ctx, msg, `已添加新${isGroup ? '群' : '个人'}笔记`);
      } else {
        // 显示笔记列表
        const notes = JSON.parse(ext.storageGet(storageKey) || '[]');
        if (!notes.length) {
          return seal.replyToSender(ctx, msg, '暂无记录');
        }
  
        // 处理分页
        const totalPages = Math.ceil(notes.length / config.pageSize);
        let page = 1;
        if (Number.isInteger(pageArg)) {
          page = Math.min(Math.max(1, pageArg), totalPages);
        }
        
        // 强制更新缓存
        const cacheKey = `${storageKey}_${senderId}`;
        pageCache.set(cacheKey, { page, notes });
  
        // 构建输出
        const start = (page - 1) * config.pageSize;
        const pageNotes = notes.slice(start, start + config.pageSize);
        
        let output = [`=== ${isGroup ? '群' : '个人'}笔记 ===`];
        pageNotes.forEach((note, idx) => {
          output.push(`${start + idx + 1}. [${new Date(note.timestamp).toLocaleString()}]`);
          output.push(note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''));
        });
        
        output.push(`\n第 ${page}/${totalPages} 页`);
        output.push('使用 .note [+页码] 翻页');
        
        seal.replyToSender(ctx, msg, output.join('\n'));
      }
    };
  
    // 翻页处理
    const solvePage = (isGroup) => (ctx, msg, cmdArgs) => {
      const keyPrefix = isGroup ? 'gnote' : 'note';
      const senderId = msg.sender.userId;
      const groupId = ctx.group?.groupId || 'private';
      const storageKey = `${keyPrefix}_${isGroup ? groupId : senderId}`;
      const cacheKey = `${storageKey}_${senderId}`;
      
      // 强制刷新数据
      const notes = JSON.parse(ext.storageGet(storageKey) || '[]');
      const totalPages = Math.ceil(notes.length / defaultConfig.pageSize);
      
      let cached = pageCache.get(cacheKey) || { page: 1 };
      cached.notes = notes; // 更新缓存数据
      cached.page = Math.max(1, Math.min(cached.page, totalPages));
  
      // 处理翻页
      const action = cmdArgs.args[0];
      if (action === '+') {
        cached.page = Math.min(cached.page + 1, totalPages);
      } else if (action === '-') {
        cached.page = Math.max(cached.page - 1, 1);
      }
      
      pageCache.set(cacheKey, cached);
      solveHandler(isGroup)(ctx, msg, { getArgN: () => '' });
    };
  
    // 绑定指令
    cmdNote.solve = solveHandler(false);
    cmdGnote.solve = solveHandler(true);
    cmdNote.solvePage = solvePage(false);
    cmdGnote.solvePage = solvePage(true);
    
    // 注册指令
    ext.cmdMap['note'] = cmdNote;
    ext.cmdMap['gnote'] = cmdGnote;
  
    seal.ext.register(ext);
  }