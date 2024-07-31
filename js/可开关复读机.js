// ==UserScript==
// @name         可开关复读机
// @description  可开关复读机.rpt on/off
// @version      1.0.0
// @autor        冷筱华
// @timestamp    2024-07-31
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

// 全局对象用于存储每个群组的复读消息
const groupRepeatMessages = {};
if (!seal.ext.find('repeat')) {
    const ext = seal.ext.new('repeat', '冷筱华', '1.0.0');
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
        const rptStatus = ext.storageGet(`${ctx.group.groupId}_rpt`);
        if (rptStatus !== 'on') return;
        if (checkRepeatMessages(msg, ctx.group.groupId)) {
            seal.replyToSender(ctx, msg, msg.message);
            ext.storageSet(`${ctx.group.groupId}_rpt_last`, msg.message);
        }
    };
    ext.cmdMap['rpt'] = cmdRpt;
    seal.ext.register(ext);
    // 检测重复消息
    function checkRepeatMessages(msg, groupId) {
        if (!groupRepeatMessages[groupId]) {
            groupRepeatMessages[groupId] = [];
        }
        const messages = groupRepeatMessages[groupId];
        messages.push(msg.message);
        if (messages.length > 4) {
            messages.shift(); 
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
