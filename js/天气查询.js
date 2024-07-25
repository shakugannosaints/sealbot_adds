// ==UserScript==
// @name         天气查询
// @author       冷筱华
// @version      1.0.0
// @description  查询天气，返回城市的天气信息。
// @timestamp    2024-7-25
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

if (!seal.ext.find("weather")) {
  const ext = seal.ext.new("weather", "[Your Name]", "1.0.0");

  const cmdWeather = seal.ext.newCmdItemInfo();
  cmdWeather.name = "wt";
  cmdWeather.help = "查询天气，可用.wt <城市>来获取天气信息";
  cmdWeather.solve = async (ctx, msg, cmdArgs) => {
    let val = cmdArgs.rawArgs;

    switch (val) {
      case "help": {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }

      default: {
        if (!val) {
          seal.replyToSender(ctx, msg, `请输入城市名称...`);
          return;
        }

        let cityName = encodeURIComponent(val);
        let apiUrl = `https://api.qjqq.cn/api/Weather?city_name=${cityName}`;

        try {
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`天气API请求失败，状态码: ${response.status}`);
          }

          const {data} = await response.json();

          if (data.result.current_condition) {
            let weatherMessage = `【${data.result.city_name}天气】\n当前天气: ${data.result.current_condition}\n温度: ${data.result.current_temperature}°C\n今日最高/最低气温：${data.result.dat_high_temperature}/${data.result.dat_low_temperature}\n更新时间: ${new Date(data.result.current_time * 1000).toLocaleString()}\n温馨提醒: ${data.result.tips}`;
            seal.replyToSender(ctx, msg, weatherMessage);
          } else {
            seal.replyToSender(ctx, msg, "没找到该城市的天气信息...");
          }
          if (Array.isArray(data.result.alert) && data.result.alert.length > 0) {
            let alerts = data.result.alert.map(alert => {
                return `请注意，当前城市有【${alert.level}${alert.name}】预警，发布时间${alert.pub_time}。\n详细信息：${alert.content}\n\n`;
            });
        
            let allAlerts = alerts.join('');
            seal.replyToSender(ctx, msg, allAlerts);
        }
        } catch (error) {
          let errors = ("天气API请求错误！错误原因：" + error.message);
          seal.replyToSender(ctx, msg, errors);
        }

        return seal.ext.newCmdExecuteResult(true);
      }
    };
  };

  // 注册命令
  ext.cmdMap["wt"] = cmdWeather;

  // 注册扩展
  seal.ext.register(ext);
}