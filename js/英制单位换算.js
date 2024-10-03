// ==UserScript==
// @name         英制单位换算
// @description  英制单位换算支持多种单位
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-10-03
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// @updateURL https://raw.githubusercontent.com/shakugannosaints/sealbot_adds/main/js
// ==/UserScript==

if (!seal.ext.find("convert")) {
  const ext = seal.ext.new("convert", "冷筱华", "1.0.0");
  const cmdConvert = seal.ext.newCmdItemInfo();
  cmdConvert.name = "换算";
  cmdConvert.help = "英制到公制单位换算，例如：.convert 5 ft 或 .convert 10 lb";

  // 定义一个简单的模式匹配函数
  function match(value, patterns) {
    for (const [pattern, handler] of patterns) {
      if (pattern.includes(value)) {
        return handler();
      }
    }
    return null;
  }

  cmdConvert.solve = (ctx, msg, cmdArgs) => {
    // 获取参数
    const value = parseFloat(cmdArgs.args[0]);
    const unit = cmdArgs.args[1].toLowerCase();

    if (isNaN(value)) {
      seal.replyToSender(ctx, msg, '请输入正确的数值');
      return seal.ext.newCmdExecuteResult(false);
    }

    // 单位转换的模式匹配
    const resultAndUnit = match(unit, [
      [['ft', '英尺'], () => ({ result: value * 0.3048, outputUnit: 'm' })],
      [['lb', '磅'], () => ({ result: value * 0.45359237, outputUnit: 'kg' })],
      [['m', '米'], () => ({ result: value * 3.2808399, outputUnit: 'ft' })],
      [['kg', '千克'], () => ({ result: value * 2.20462, outputUnit: 'lb' })],
      [['in', '英寸'], () => ({ result: value * 2.54, outputUnit: 'cm' })],
      [['cm', '厘米'], () => ({ result: value / 2.54, outputUnit: 'in' })],
      [['gal', '加仑'], () => ({ result: value * 3.78541, outputUnit: 'L' })],
      [['l', '升'], () => ({ result: value / 3.78541, outputUnit: 'gal' })],
      [['f', '华氏度'], () => ({ result: (value - 32) * 5/9, outputUnit: '℃' })],
      [['c', '摄氏度'], () => ({ result: value * 9/5 + 32, outputUnit: '℉' })]
    ]);

    if (resultAndUnit) {
      const { result, outputUnit } = resultAndUnit;
      // 回复结果
      seal.replyToSender(ctx, msg, `${value} ${unit} 等于 ${result.toFixed(2)} ${outputUnit}`);
      return seal.ext.newCmdExecuteResult(true);
    } else {
      seal.replyToSender(ctx, msg, '不支持的单位，请使用 "ft"（英尺）、"lb"（磅）、"m"（米）、"kg"（千克）、"in"（英寸）、"cm"（厘米）、"gal"（加仑）、"L"（升）、"F"（华氏度）或 "C"（摄氏度）');
      return seal.ext.newCmdExecuteResult(false);
    }
  };

  seal.ext.register(ext);
  ext.cmdMap["换算"] = cmdConvert;
}