// ==UserScript==
// @name         来张狗图
// @author       冷筱华
// @version      1.0.1
// @description  来张狗图
// @timestamp    2024-07-22
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

const thedogapi_key = 'your-api-key';

if (!seal.ext.find('dogApi')) {
  const ext = seal.ext.new('dogApi', '冷筱华', '1.0.1');

  const cmddog = seal.ext.newCmdItemInfo();
  cmddog.name = 'dog';
  cmddog.help = `发送一张随机的dog图片。用法：
  .dog
  .dog lb
  .dog bid bid`
  cmddog.solve = async (ctx, msg, cmdArgs) => {
    try {
      let data ={};
      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'lb') {
        const breeds = await fetch('https://api.thedogapi.com/v1/breeds', { headers: {'x-api-key': thedogapi_key}});
        const breedsJson = await breeds.json();
        const breedsList = breedsJson.map(breed => `${breed.id} (${breed.name})`).join(' | ');
        seal.replyToSender(ctx, msg, `可用的狗狗品种代码：\n${breedsList}`);
        return seal.ext.newCmdExecuteResult(true);
      }
      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'lc') {
        const dogegories = await fetch('https://api.thedogapi.com/v1/dogegories', { headers: {'x-api-key': thedogapi_key}});
        const dogegoriesJson = await dogegories.json();
        const dogegoriesList = dogegoriesJson.map(dogegory => `${dogegory.id} (${dogegory.name})`).join(' | ');
        seal.replyToSender(ctx, msg, `可用的狗狗分类代码：\n${dogegoriesList}`);
        return seal.ext.newCmdExecuteResult(true);
      }

      if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'bid') {
        let apiUrl = 'https://api.thedogapi.com/v1/images/search';
        if (cmdArgs.args.length > 0 && cmdArgs.args[0] === 'bid') {
            apiUrl += `?breed_ids=${encodeURIComponent(cmdArgs.args[1])}`;
        }
        const response = await fetch(apiUrl, {
            headers: {
                'x-api-key': thedogapi_key
            }
        });
        data = await response.json();

      }

      if (cmdArgs.args.length == 0) {
        const response = await fetch('https://api.thedogapi.com/v1/images/search', { headers: {'x-api-key': thedogapi_key} });
        data = await response.json();
      }



      if (data.length > 0) {
        const imageUrl = data[0].url;
        const cqImage = `[CQ:image,file=${(imageUrl)}]`;
        seal.replyToSender(ctx, msg, cqImage);
      } else {
        seal.replyToSender(ctx, msg, '无法获取dog图片，请稍后再试。');
      }
    } catch (error) {
      seal.replyToSender(ctx, msg, '发生错误：' + error.message);
    }
    return seal.ext.newCmdExecuteResult(true);
  };

  seal.ext.register(ext);
  ext.cmdMap['dog'] = cmddog;
  ext.cmdMap['狗狗'] = cmddog;
  ext.cmdMap['来张狗图'] = cmddog;
}