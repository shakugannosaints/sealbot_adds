// ==UserScript==
// @name         RunCode
// @version      1.0.0
// @author       冷筱华
// @description  运行代码并返回结果
// @timestamp    2024-7-22
// @license      AGPL-3.0
// @homepageURL  https://koishi.icemoe.moe/sealdice/runCode.html
// ==/UserScript==

const GLOT_BASE = 'https://glot.io/api';
const apiToken = 'your-api-key';

function runCode(language, filename, code, stdin) {
  const data = {
    files: [{
      name: filename,
      content: code,
    }]
  };
  if (stdin) data.stdin = stdin;

  return fetch(`${GLOT_BASE}/run/${language}/latest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiToken}`
    },
    body: JSON.stringify(data)
  })
  .then((response) => response.json())
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error('Error:', error);
    return null;
  });
}

if (!seal.ext.find('runCode')) {
  const ext = seal.ext.new('runCode', '冷筱华', '1.0.0');
  const cmdRunCode = seal.ext.newCmdItemInfo();
  cmdRunCode.name = 'run';
  cmdRunCode.help = '运行代码并返回结果。用法：.run 语言（不可省略） 代码。例：.run python print(0.1+0.2)';
  cmdRunCode.solve = async (ctx, msg, cmdArgs) => {
    if (!(await checkPermissions(ctx, msg))) return;
    const args = cmdArgs.args;
    const rawArgs = cmdArgs.rawArgs;
  
    if (args.length < 2) {
      seal.replyToSender(ctx, msg, '请输入代码和语言。例如：.run javascript console.log("Hello World");');
      return seal.ext.newCmdExecuteResult(true);
    }
  
    const language = args[0];
    const code = rawArgs.substring(language.length + 1).trim();
  
    if (!code) {
      seal.replyToSender(ctx, msg, '请输入代码。');
      return seal.ext.newCmdExecuteResult(true);
    }
  
    const result = await runCode(language, `code.${language}`, code);
    if (!result) {
      seal.replyToSender(ctx, msg, '请求出错。');
      return seal.ext.newCmdExecuteResult(true);
    }
    if (result.error) {
      seal.replyToSender(ctx, msg, `运行出错: ${result.error}\n${result.stderr}`);
    } else {
      seal.replyToSender(ctx, msg, result.stdout + result.stderr);
    }
    return seal.ext.newCmdExecuteResult(true);
  };

  seal.ext.register(ext);
  ext.cmdMap['run'] = cmdRunCode;
  ext.cmdMap['运行代码'] = cmdRunCode;

        // 白名单和黑名单配置
        seal.ext.registerTemplateConfig(
          ext,
          'whitelist1',
          ['UI:1001'],
          '白名单列表。支持指定用户或群，如 QQ:114514、QQ-Group:1919810。'
      );
      seal.ext.registerTemplateConfig(
          ext,
          'blacklist1',
          [''],
          '黑名单列表。比白名单优先级更高。'
      );
      // 检查用户是否有权限使用
      const checkPermissions = async (ctx, msg) => {
        const whitelist = seal.ext.getConfig(ext, 'whitelist1');
        const blacklist = seal.ext.getConfig(ext, 'blacklist1')?.value ?? [];
        const groupId = msg.groupId;
        const senderId = msg.sender.userId;
        for (const black of blacklist) {
            if (black === groupId || black === senderId) {
                seal.replyToSender(
                    ctx,
                    msg,
                    seal.format(ctx, '{核心:提示_无权限}')
                );
                return false;
            }
        }
        if (whitelist) {
            let hasPermission = false;
            for (const white of whitelist.value) {
                if (white === groupId || white === senderId) {
                    hasPermission = true;
                    break;
                }
            }
            if (!hasPermission) {
                seal.replyToSender(
                    ctx,
                    msg,
                    seal.format(ctx, '{核心:提示_无权限}')
                );
                return false;
            }
        }
        return true;
    };

}
