// ==UserScript==
// @name         DnDSpellScript
// @author       小嘟嘟噜
// @version      1.0.2
// @description  DnD法术脚本
// @timestamp    2024-07-22
// @license      AGPL-3.0
// @homepageURL  https://github.com/yourusername/your-repo
// ==/UserScript==

const API_URL = 'http://localhost:8080';

if (!seal.ext.find('dnd_spell')) {
  const ext = seal.ext.new('dnd_spell', '小嘟嘟噜', '1.0.2');

  const cmdCastSpell = seal.ext.newCmdItemInfo();
  cmdCastSpell.name = 'cs';
  cmdCastSpell.help = '用法：.cs 法术名 [环数]';
  cmdCastSpell.solve = async (ctx, msg, cmdArgs) => {
    try {
      const args = cmdArgs.rawArgs.split(' ');
      if (args.length < 1) {
        return seal.replyToSender(ctx, msg, '请指定法术名称');
      }
      
      const spellName = args[0];
      const level = parseInt(args[1]) || 3;

      // 从 HTTP 服务器获取法术信息
      const response = await fetch(`${API_URL}/api/get_spell?name=${encodeURIComponent(spellName)}`);
      if (!response.ok) {
        throw new Error('无法获取法术信息');
      }
      const spellData = await response.json();

      if (!spellData.damage || !spellData.damage.damage_at_slot_level) {
        return seal.replyToSender(ctx, msg, '该法术没有伤害信息');
      }

      // 获取对应环数的伤害骰子
      const damageDice = spellData.damage.damage_at_slot_level[level.toString()];
      if (!damageDice) {
        return seal.replyToSender(ctx, msg, `没有${level}环的伤害信息`);
      }

      // 解析伤害骰子（例如："8d6"）
      const [diceCount, diceSides] = damageDice.split('d').map(Number);

      // 随机生成伤害
      const damage = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * diceSides) + 1);
      const totalDamage = damage.reduce((a, b) => a + b, 0);

      // 构造返回消息
      const playerName = ctx.nickname || '玩家';  // 使用发送消息的玩家昵称
      const final = `${playerName}>为${level}环${spellName}骰伤害，结果为${damageDice}=${totalDamage} (${damage.join('+')})`;

      seal.replyToSender(ctx, msg, final);
    } catch (error) {
      seal.replyToSender(ctx, msg, '发生错误：' + error.message);
    }

    return seal.ext.newCmdExecuteResult(true);
  };

  seal.ext.register(ext);
  ext.cmdMap['cs'] = cmdCastSpell;
}
