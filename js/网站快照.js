// ==UserScript==
// @name         快照
// @description  .快照 <参数>
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-08-02
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
 // 白名单和黑名单配置
 
if (!seal.ext.find('KuaZ')) {
    const ext = seal.ext.new('KuaZ', '冷筱华', '1.0.0');
    const cmdKuaZ = seal.ext.newCmdItemInfo();
    cmdKuaZ.name = '快照';
    cmdKuaZ.help = '用法：.快照';
    seal.ext.register(ext);

//
seal.ext.registerTemplateConfig(
    ext,
    'whitelist',
    ['UI:1001'],
    '白名单列表。支持指定用户或群，如 QQ:114514、QQ-Group:1919810。'
);
seal.ext.registerTemplateConfig(
    ext,
    'blacklist',
    [''],
    '黑名单列表。比白名单优先级更高。'
);
// 检查用户是否有权限使用.chat_ori
const checkPermissions = async (ctx, msg) => {
    const whitelist = seal.ext.getConfig(ext, 'whitelist');
    const blacklist = seal.ext.getConfig(ext, 'blacklist')?.value ?? [];

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


//

    cmdKuaZ.solve = async (ctx, msg, cmdArgs) => {
        if (!(await checkPermissions(ctx, msg))) return;
        const imgname = cmdArgs.args[0];
            const CQ=`[CQ:image,file=https://api.shenke.love/api/wzjt.php?url=${imgname}]`;
            seal.replyToSender(ctx, msg, CQ);
    }

    ext.cmdMap['快照'] = cmdKuaZ;
  }