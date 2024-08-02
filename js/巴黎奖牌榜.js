// ==UserScript==
// @name         巴黎奥运奖牌榜
// @description  .bljp
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-08-02
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==
if (!seal.ext.find('bljp')) {
    const ext = seal.ext.new('bljp', '冷筱华', '1.0.0');
    const cmdbljp = seal.ext.newCmdItemInfo();
    cmdbljp.name = 'bljp';
    cmdbljp.help = '用法：.bljp';
    cmdbljp.solve = async (ctx, msg, cmdArgs) => {
        try {
            const response = await fetch('https://api.shenke.love/api/aoyunhui/Olympics.php', {
                method: 'GET',
            });

            // Check if the response is successful before proceeding
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response; // Assuming the response is JSON
// If you need to modify the data, do it here
            remsg=JSON.stringify(data);
            remsg=remsg.replace(/{".*body":/g,'');
            remsg=remsg.replace(/"headers":{"_headers".*/g,'');
            seal.replyToSender(ctx, msg, remsg);
        } catch (error) {
            console.error(error.stack); // Log the full error for debugging
            seal.replyToSender(ctx, msg, `发生错误: ${error.message}`);
        }
    }
    seal.ext.register(ext);
    ext.cmdMap['bljp'] = cmdbljp;
}