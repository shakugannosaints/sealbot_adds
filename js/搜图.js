// ==UserScript==
// @name         搜图
// @description  .搜图 <参数>
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-08-02
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
if (!seal.ext.find('soutu')) {
  const ext = seal.ext.new('soutu', '冷筱华', '1.0.0');
  const cmdsoutu = seal.ext.newCmdItemInfo();
  cmdsoutu.name = '搜图';
  cmdsoutu.help = '用法：.搜图';
  cmdsoutu.solve = async (ctx, msg, cmdArgs) => {
      const imgname = cmdArgs.args[0];
      try {
          const response = await fetch(`https://api.shenke.love/api/360st.php?msg=${imgname}`, {
              method: 'GET',
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          let data = await response; 
          const CQ=`[CQ:image,file=${data.body}]`;
          seal.replyToSender(ctx, msg, CQ);
      } catch (error) {
          console.error(error.stack); // Log the full error for debugging
          seal.replyToSender(ctx, msg, `发生错误: ${error.message}\n${error.stack}`);
      }
  }
  seal.ext.register(ext);
  ext.cmdMap['搜图'] = cmdsoutu;
}