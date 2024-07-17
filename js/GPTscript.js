// ==UserScript==
// @name         GPTscript
// @author       容易
// @version      1.0.0
// @description  GPTscript
// @timestamp    2024-07-17
// @license      AGPL-3.0
// @homepageURL  https://github.com/shakugannosaints/sealbot_adds/tree/main/js
// ==/UserScript==

const OPENROUTER_API_KEY = 'your-api-key'

if (!seal.ext.find('chat_ori')) {
  const ext = seal.ext.new('chat_ori', '容易', '1.0.0')

  const cmdCat = seal.ext.newCmdItemInfo()
  cmdCat.name = 'chat_ori'
  cmdCat.help = '发送一张随机的cat图片。用法：.chat_ori'
  cmdCat.solve = async (ctx, msg, cmdArgs) => {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          //文档：
          //https://openrouter.ai/docs/models
          //https://openrouter.ai/docs/requests
          //常用模型：
          //openai/gpt-4o
          //anthropic/claude-3.5-sonnet
          //anthropic/claude-3-haiku
          model: 'anthropic/claude-3-haiku',
          messages: [
            { role: 'system', content: '你希望AI扮演的角色。例：你是一只小猫，整天喵喵喵喵。' },
            { role: 'user', content: cmdArgs.rawArgs.slice(0, 100) }
          ],
          max_tokens: 500
        })
      })
      const raw = await r.json()
      const res = raw.choices[0].message.content
      seal.replyToSender(ctx, msg, res)
    } catch (error) {
      seal.replyToSender(ctx, msg, '发生错误：' + error.message)
    }

    return seal.ext.newCmdExecuteResult(true)
  }

  seal.ext.register(ext)
  ext.cmdMap['chat_ori'] = cmdCat
}