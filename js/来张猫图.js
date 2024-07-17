// ==UserScript==
// @name         来张猫图
// @author       冷筱华
// @version      1.0.0
// @description  来张猫图
// @timestamp    2024-07-17
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

const thecatapi_key = 'your-api-key'; 
//api获取：https://thecatapi.com/

if (!seal.ext.find('catApi')) {
  const ext = seal.ext.new('catApi', '冷筱华', '1.0.0');

  const cmdCat = seal.ext.newCmdItemInfo();
  cmdCat.name = 'cat';
  cmdCat.help = '发送一张随机的cat图片。用法：.cat';
  cmdCat.solve = async (ctx, msg, cmdArgs) => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search', { headers: {
        'x-api-key': thecatapi_key 
      } });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const imageUrl = data[0].url;
          const cqImage = `[CQ:image,file=${(imageUrl)}]`;
          seal.replyToSender(ctx, msg, cqImage);
        } else {
          seal.replyToSender(ctx, msg, '无法获取cat图片，请稍后再试。');
        }
      } else {
        seal.replyToSender(ctx, msg, '服务器返回错误，请稍后再试。');
      }
    } catch (error) {
      seal.replyToSender(ctx, msg, '发生错误：' + error.message);
    }

    return seal.ext.newCmdExecuteResult(true);
  };

  seal.ext.register(ext);
  ext.cmdMap['cat'] = cmdCat;
  ext.cmdMap['猫猫'] = cmdCat;
  ext.cmdMap['来张猫图'] = cmdCat;
}