// ==UserScript==
// @name         可开关复读机
// @description  可开关复读机.rpt on/off
// @version      1.0.1
// @autor        冷筱华
// @timestamp    2024-07-31
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

// 全局对象用于存储每个群组的复读消息
const groupRepeatMessages = {};
globalThis.remsg ='';
globalThis.jdmsg ='';
if (!seal.ext.find('repeat')) {
    const ext = seal.ext.new('repeat', '冷筱华', '1.0.1');
    const cmdRpt = seal.ext.newCmdItemInfo();
    cmdRpt.name = 'rpt';
    cmdRpt.help = '复读功能';
    cmdRpt.solve = (ctx, msg, cmdArgs) => {
        if (cmdArgs.args[0] == 'on') {
            ext.storageSet(`${ctx.group.groupId}_rpt`, 'on');
            seal.replyToSender(ctx, msg, '复读功能已启用。');
        } else if (cmdArgs.args[0] == 'off') {
            ext.storageSet(`${ctx.group.groupId}_rpt`, 'off');
            seal.replyToSender(ctx, msg, '复读功能已禁用');
        } else {
            seal.replyToSender(ctx, msg, '请输入参数on/off');
        }
    };

    // 监听非命令消息
    ext.onNotCommandReceived = (ctx, msg) => {
        const regex = /\[CQ:image,file=([^,]+),subType=[^,]+,url=([^,]+),file_size=[^]+\]/gi;
        remsg =msg.message;
        jdmsg=msg.message;
        jdmsg= jdmsg.replace(regex,'[CQ:image,file=$1');
        remsg=remsg.replace(regex,'[CQ:image,file=$2]');
        remsg=remsg.replace('https','http');
        const rptStatus = ext.storageGet(`${ctx.group.groupId}_rpt`);
        if (rptStatus !== 'on') return;

        // 检查消息是否为重复消息
        if (checkRepeatMessages(msg, ctx.group.groupId)) {
            seal.replyToSender(ctx, msg, remsg);
            // 设置标志
            ext.storageSet(`${ctx.group.groupId}_rpt_last`, jdmsg);
        }
    };

    ext.cmdMap['rpt'] = cmdRpt;
    seal.ext.register(ext);

    // 检测重复消息
    function checkRepeatMessages(msg, groupId) {
        // 确保 groupRepeatMessages[groupId] 被初始化
        if (!groupRepeatMessages[groupId]) {
            groupRepeatMessages[groupId] = [];
        }

        // 检查连续
        const messages = groupRepeatMessages[groupId];
        messages.push(jdmsg);

        // 保持消息队列不超过4条消息
        if (messages.length > 4) {
            messages.shift(); // 移除最老的消息
        }

        // 检查最后三条消息是否相同，并且不是上一次被复读的消息
        const lastRptMessage = ext.storageGet(`${groupId}_rpt_last`);
        if (messages.length >= 3 &&
            messages[messages.length - 1] === messages[messages.length - 2] &&
            messages[messages.length - 2] === messages[messages.length - 3] &&
            messages[messages.length - 1] !== lastRptMessage) {
            return true;
        }
        return false;
    }
}
