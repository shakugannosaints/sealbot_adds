// ==UserScript==
// @name         条码
// @description  .条码 <参数>
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-08-02
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
if (!seal.ext.find('TiaoM')) {
    const ext = seal.ext.new('TiaoM', '冷筱华', '1.0.0');
    const cmdTiaoM = seal.ext.newCmdItemInfo();
    cmdTiaoM.name = '条码';
    cmdTiaoM.help = '用法：.条码';
    cmdTiaoM.solve = async (ctx, msg, cmdArgs) => {
        const imgname = cmdArgs.args[0];
            const CQ=`[CQ:image,file=https://api.shenke.love/api/txm.php?msg=${imgname}]`;
            seal.replyToSender(ctx, msg, CQ);
    }
    seal.ext.register(ext);
    ext.cmdMap['条码'] = cmdTiaoM;
    ext.cmdMap['条形码'] = cmdTiaoM;
  }