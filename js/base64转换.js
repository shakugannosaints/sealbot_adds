// ==UserScript==
// @name         Base64 Converter
// @author       冷筱华
// @version      1.0.2
// @description  Converts text to base64 and vice versa,//.t2b for text2base64, and .b2t for base642text
// @timestamp    2024-07-17
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

// 定义扩展
if (!seal.ext.find('base64Converter')) {
  const ext = seal.ext.new('base64Converter', '冷筱华', '1.0.2');

  // t2b:文本 转换 文本 为 base64
  const cmdA2B = seal.ext.newCmdItemInfo();
  cmdA2B.name = 't2b';
  cmdA2B.help = '将文本转化为base64编码。用法：.t2b 文本';
  cmdA2B.solve = (ctx, msg, cmdArgs) => {
    let text = cmdArgs.rawArgs;
    if (!text) {
      seal.replyToSender(ctx, msg, '请输入要转换为 base64 的文本！');
      return seal.ext.newCmdExecuteResult(false);
    }
    let encoded = btoa(text);
    seal.replyToSender(ctx, msg, `${encoded}`);
    return seal.ext.newCmdExecuteResult(true);
  };
  
  // b2t:文本 转换 base64 为 文本
  const cmdB2A = seal.ext.newCmdItemInfo();
  cmdB2A.name = 'b2t';
  cmdB2A.help = '将base64编码转化为文本。用法：.b2t base64编码';
  cmdB2A.solve = (ctx, msg, cmdArgs) => {
    let base64 = cmdArgs.getArgN(1);
    if (!base64) {
      seal.replyToSender(ctx, msg, '请输入要解码的 base64 字符串！');
      return seal.ext.newCmdExecuteResult(false);
    }
    try {
      let decoded = atob(base64);
      seal.replyToSender(ctx, msg, `${decoded}`);
      return seal.ext.newCmdExecuteResult(true);
    } catch (e) {
      seal.replyToSender(ctx, msg, '提供的 base64 编码无效！');
      return seal.ext.newCmdExecuteResult(false);
    }
  };
  
  // 注册扩展
  seal.ext.register(ext);
  // 注册命令
  ext.cmdMap['t2b'] = cmdA2B;
  ext.cmdMap['b2t'] = cmdB2A;
}