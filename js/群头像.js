// ==UserScript==
// @name         获取群头像
// @description  .群头像
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-11-11
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
 
if (!seal.ext.find('GroupIcon')) {
    const ext = seal.ext.new('GroupIcon', '冷筱华', '1.0.0');
    const cmdGroupIcon = seal.ext.newCmdItemInfo();
    cmdGroupIcon.name = '群头像';
    cmdGroupIcon.help = '用法：.群头像';
    cmdGroupIcon.solve = async (ctx, msg, cmdArgs) => {
        let groupid=msg.groupId;
            groupid=groupid.replace('QQ-Group:','');
            const CQ=`[CQ:image,file=https://p.qlogo.cn/gh/${groupid}/${groupid}/]`;
            seal.replyToSender(ctx, msg, CQ);
    }
    ext.cmdMap['群头像'] = cmdGroupIcon;
    seal.ext.register(ext);
  }