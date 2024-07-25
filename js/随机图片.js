// ==UserScript==
// @name         随机图片
// @author       冷筱华
// @version      1.0.0
// @description  通过 .pic 命令返回随机图片
// @timestamp    2024-7-25
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

if (!seal.ext.find("randomPic")) {
  let imgUrl='https://api.qjqq.cn/api/Img';
  const ext = seal.ext.new("randomPic", "[冷筱华]", "1.0.0");
  const cmdRandomPic = seal.ext.newCmdItemInfo();
  cmdRandomPic.name = "pic";
  cmdRandomPic.help = "获取随机图片，可用 .pic 调用。参数：acg（动漫）scenery（风景）bd_acg（白底动漫）belle（小姐姐）";
  cmdRandomPic.solve = (ctx, msg, cmdArgs) => {
    const Args = ['acg', 'scenery', 'bg_acg', 'belle'];
    if (Args.includes(cmdArgs.args[0])) {
      imgUrl = `https://api.qjqq.cn/api/Img?sort=${cmdArgs.args[0]}`
    } else {
      imgUrl = `https://api.qjqq.cn/api/Img`;
    }
        const cqImage = `[CQ:image,file=${imgUrl}]`;
        seal.replyToSender(ctx, msg, cqImage);
        return seal.ext.newCmdExecuteResult(true);
  };
  seal.ext.register(ext);
  ext.cmdMap["pic"] = cmdRandomPic;
}