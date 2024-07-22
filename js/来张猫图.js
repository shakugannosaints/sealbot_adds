// ==UserScript==
// @name         来张猫图
// @author       冷筱华
// @version      1.0.1
// @description  来张猫图
// @timestamp    2024-07-22
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

const thecatapi_key = 'your-api-key';

if (!seal.ext.find('catApi')) {
  const ext = seal.ext.new('catApi', '冷筱华', '1.0.1');

  const cmdCat = seal.ext.newCmdItemInfo();
  cmdCat.name = 'cat';
  cmdCat.help = `发送一张随机的cat图片。用法：
  .cat
  .cat lb
  .cat lc
  .cat bid bid
  .cat cid cid`;
  cmdCat.solve = async (ctx, msg, cmdArgs) => {
    try {
      let data ={};
      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'lb') {
        const breeds = await fetch('https://api.thecatapi.com/v1/breeds', { headers: {'x-api-key': thecatapi_key}});
        const breedsJson = await breeds.json();
        const breedsList = breedsJson.map(breed => `${breed.id} (${breed.name})`).join(' | ');
        seal.replyToSender(ctx, msg, `可用的猫猫品种代码：\n${breedsList}`);
        return seal.ext.newCmdExecuteResult(true);
      }
      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'lc') {
        const categories = await fetch('https://api.thecatapi.com/v1/categories', { headers: {'x-api-key': thecatapi_key}});
        const categoriesJson = await categories.json();
        const categoriesList = categoriesJson.map(category => `${category.id} (${category.name})`).join(' | ');
        seal.replyToSender(ctx, msg, `可用的猫猫分类代码：\n${categoriesList}`);
        return seal.ext.newCmdExecuteResult(true);
      }

      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'bid') {
        let apiUrl = 'https://api.thecatapi.com/v1/images/search';
        if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'bid') {
            apiUrl += `?breed_ids=${encodeURIComponent(cmdArgs.args[1])}`;
        }
        const response = await fetch(apiUrl, {
            headers: {
                'x-api-key': thecatapi_key
            }
        });
        data = await response.json();

      }

      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'cid') {
        let apiUrl = 'https://api.thecatapi.com/v1/images/search';
        if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'cid') {
            apiUrl += `?category_ids=${encodeURIComponent(cmdArgs.args[1])}`;
        }
        const response = await fetch(apiUrl, {
            headers: {
                'x-api-key': thecatapi_key
            }
        });
        data = await response.json();
      }

      if (cmdArgs.args.length == 0) {
        const response = await fetch('https://api.thecatapi.com/v1/images/search', { headers: {'x-api-key': thecatapi_key} });
        data = await response.json();
      }



      if (data.length > 0) {
        const imageUrl = data[0].url;
        const cqImage = `[CQ:image,file=${(imageUrl)}]`;
        seal.replyToSender(ctx, msg, cqImage);
      } else {
        seal.replyToSender(ctx, msg, '无法获取cat图片，请稍后再试。');
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