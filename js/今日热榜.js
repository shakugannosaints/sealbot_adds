// ==UserScript==
// @name         今日热榜
// @description  .jrrb
// @version      1.0.0
// @author       冷筱华
// @timestamp    2024-07-28
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

    key=`your-api-key`;
    if (!seal.ext.find('jrrb')) {
        const ext = seal.ext.new('jrrb', '冷筱华', '1.0.0');
        const cmdJrrb = seal.ext.newCmdItemInfo();
        cmdJrrb.name = 'jrrb';
        cmdJrrb.help = '用法：.jrrb 网站。支持哔哩哔哩，百度，知乎，百度贴吧，少数派，IT之家，澎湃新闻，今日头条，微博热搜，36氪，稀土掘金，腾讯新闻';
        cmdJrrb.solve = async (ctx, msg, cmdArgs) => {
            let title=cmdArgs.args[0];
            page=cmdArgs.args[1];
            page = Math.floor(page);
            if (page <= 0||!Number.isInteger(page)) {
                page = 1;
            }
            title=encodeURIComponent(title);
            try {
                const response = await fetch(`https://api.lemonso.com/api/hot/query?key=${key}&title=`+title, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                if (data.code === 200) {
                    //组织标题
                    pagenum=data.data.length/5;
                    pagenum = Math.ceil(pagenum);
                    if (page >= pagenum) {
                        page = pagenum;
                    };
                    const titles = data.data.slice((page-1)*5,page*5).map(item => `${item.title}\n${item.url}`);
                    let numberedTitles = [];
                    titles.forEach((title, index) => {
                        numberedTitles.push(`${(page-1)*5+index + 1}. ${title}`);
                    });
                    const titlesString = numberedTitles.join('\n');
                
                    seal.replyToSender(ctx, msg, titlesString+'\n第'+page+'/'+pagenum+'页');
                } else {
                    seal.replyToSender(ctx, msg, 'API返回错误: ' + data.msg);
                }
            } catch (error) {
                seal.replyToSender(ctx, msg, '消息频率过高或其他错误，请暂缓使用。');
            }
        }
    
        seal.ext.register(ext);
        ext.cmdMap['jrrb'] = cmdJrrb;
    }