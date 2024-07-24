// ==UserScript==
// @name         点歌 
// @author       冷筱华（基于@星尘的微调）
// @version      1.0.4
// @description  点歌，返回能直接播放的音乐卡片，方便放bgm。可用".点歌 歌名 作者"或".网易云 歌名 作者"调用，前者是qq音乐，后者是网易云音乐。现在支持歌曲名中的空格。
// @timestamp    2024-7-24
// @license      Apache-2
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

if (!seal.ext.find("music")) {
  const ext = seal.ext.new("music", "冷筱华", "1.0.4");

  // qq点歌命令
  const cmdQQMusic = seal.ext.newCmdItemInfo();
  cmdQQMusic.name = "点歌";
  cmdQQMusic.help = "qq点歌，可用.点歌 <歌名 (作者)> 作者可以加也可以不加";
  cmdQQMusic.solve = async (ctx, msg, cmdArgs) => {
    let val = cmdArgs.rawArgs;

    switch (val) {
      case "help": {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }
      default: {
        if (!val) {
          seal.replyToSender(ctx, msg, `要输入歌名啊...`);
          break;
        }

        let musicName = encodeURIComponent(val);
        let url = `https://c.y.qq.com/soso/fcgi-bin/music_search_new_platform?searchid=53806572956004615&t=1&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=2&w=${musicName}`;

        try {
          const response = await fetch(url);

          if (!response.ok) {
            console.log("qq音乐api失效！");
            break;
          }

          const data = await response.text();
          const musicJson = JSON.parse(data.replace(/callback\(|\)/g, ""));

          if (musicJson.data.song.list.length === 0) {
            seal.replyToSender(ctx, msg, "没找到这首歌...");
            break;
          }

          const musicId = musicJson.data.song.list[0].f.match(/^\d+/)[0];
          const messageRet = `[CQ:music,type=qq,id=${musicId}]`;
          seal.replyToSender(ctx, msg, messageRet);
        } catch (error) {
          console.log("qq音乐api请求错误！（部分报错可能是你的海豹版本不够新）错误原因：" + error);
        }
      }
    }
  };

  // 网易云点歌命令
  const cmdCloudMusic = seal.ext.newCmdItemInfo();
  cmdCloudMusic.name = "网易云";
  cmdCloudMusic.help = "网易云点歌，可用.网易云 <歌名 (作者)> 作者可以加也可以不加";
  cmdCloudMusic.solve = async (ctx, msg, cmdArgs) => {
    let val = cmdArgs.rawArgs;

    switch (val) {
      case "help": {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }
      default: {
        if (!val) {
          seal.replyToSender(ctx, msg, `要输入歌名啊...`);
          break;
        }

        let musicName = encodeURIComponent(val);
        let url = `https://cloudmusic.aivu.top/cloudsearch?keywords=${musicName}`;

        try {
          const response = await fetch(url);

          if (!response.ok) {
            console.log(response.status);
            console.log("网易云音乐api失效！");
            break;
          }

          const data = await response.text();
          const musicJson = JSON.parse(data);

          if (musicJson.result.songCount === 0) {
            seal.replyToSender(ctx, msg, "没找到这首歌...");
            break;
          }

          const musicId = musicJson.result.songs[0].id;
          const messageRet = `[CQ:music,type=163,id=${musicId}]`;
          seal.replyToSender(ctx, msg, messageRet);
        } catch (error) {
          console.log("网易云音乐api请求错误！错误原因：" + error);
        }
      }
    }
  };

  // 注册命令
  ext.cmdMap["点歌"] = cmdQQMusic;
  ext.cmdMap["网易云"] = cmdCloudMusic;

  // 注册扩展
  seal.ext.register(ext);
}