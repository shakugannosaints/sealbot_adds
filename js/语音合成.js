// ==UserScript==
// @name         语音合成
// @author       冷筱华
// @version      1.0.0
// @description  百度接口的语音合成，格式为 .tts [jp|en（==uk）|de|zh（可省略）] 文本
// @timestamp    2024-7-25
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
if (!seal.ext.find('tts')) {
  let ttsUrl = '';
  let lang = 'zh'; // 默认语言为中文
  let text = '';
  const ext = seal.ext.new("tts", "[冷筱华]", "1.0.0");
  const cmdtts = seal.ext.newCmdItemInfo();
  cmdtts.name = 'tts';
  cmdtts.help = `百度语音合成，格式为 .tts [jp|en（==uk）|de|zh（可省略）] 文本。`;
  cmdtts.solve = (ctx, msg, cmdArgs) => {
    if (cmdArgs.args[0]) {
      if (cmdArgs.args[0] === 'jp') {
        lang ='jp';
        text = cmdArgs.rawArgs.replace(cmdArgs.args[0],'').trim();
      } else if (cmdArgs.args[0] === 'en') {
        lang ='uk';
        text = cmdArgs.rawArgs.replace(cmdArgs.args[0],'').trim();
      } else if (cmdArgs.args[0] === 'uk') {
        lang ='uk';
        text = cmdArgs.rawArgs.replace(cmdArgs.args[0],'').trim();
      } else if (cmdArgs.args[0] === 'de') {
        lang ='de';
        text = cmdArgs.rawArgs.replace(cmdArgs.args[0],'').trim();
      }else if (cmdArgs.args[0] === 'zh') {
        lang ='zh';
        text = cmdArgs.rawArgs.replace(cmdArgs.args[0],'').trim();
      }else{
        lang ='zh';
        text = cmdArgs.rawArgs.trim();
      }
      ttsUrl =`https://fanyi.baidu.com/gettts?lan=${lang}&text=${text}&spd=5`;
      const cqtts = `[CQ:record,file=${ttsUrl}]`;
      seal.replyToSender(ctx, msg, cqtts);
    } else {
      seal.replyToSender(ctx, msg, '请输入要转换为语音的文本');
      return seal.ext.newCmdExecuteResult(false);
    }
  };
  seal.ext.register(ext);
  ext.cmdMap['tts'] = cmdtts;
}