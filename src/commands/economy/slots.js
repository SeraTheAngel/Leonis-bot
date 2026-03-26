// slots.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getUser, saveUser, updateNetworth } = require('../../economy/system');

const SYMBOLS = ['🍒', '🍋', '🍊', '🔔', '💎', '7️⃣'];
const MULTIPLIERS = {
    '🍒🍒🍒': 5, '🍋🍋🍋': 8, '🍊🍊🍊': 10,
    '🔔🔔🔔': 15, '💎💎💎': 50, '7️⃣7️⃣7️⃣': 100,
};
// Par de qualquer símbolo = x0.5 de volta
function hasPair(r) { return r[0] === r[1] || r[1] === r[2] || r[0] === r[2]; }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('🎰 Caça-níquel — tente a sorte!')
        .addIntegerOption(o =>
            o.setName('aposta').setDescription('Valor da aposta').setRequired(true).setMinValue(10).setMaxValue(5000)),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        const bet = interaction.options.getInteger('aposta');

        if (user.balance < bet) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem saldo', `Você tem $${user.balance.toLocaleString()} — aposta de $${bet.toLocaleString()} é demais!`, colors.error)], ephemeral: true });
        }

        const result = [0, 0, 0].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
        const combo = result.join('');

        let won = 0;
        let resultMsg = '';

        if (MULTIPLIERS[combo]) {
            won = Math.floor(bet * MULTIPLIERS[combo]);
            user.balance += won - bet;
            resultMsg = `🎉 **JACKPOT ${combo}!** +$${won.toLocaleString()} (${MULTIPLIERS[combo]}x)`;
        } else if (hasPair(result)) {
            won = Math.floor(bet * 0.5);
            user.balance -= bet - won;
            resultMsg = `🤏 **Par!** Recuperou metade: -$${(bet - won).toLocaleString()}`;
        } else {
            user.balance -= bet;
            resultMsg = `😢 **Perdeu!** -$${bet.toLocaleString()}`;
        }

        saveUser(interaction.user.id, user);
        updateNetworth(interaction.user.id);

        const embed = createEmbed(
            '🎰 SLOTS!',
            `| ${result[0]} | ${result[1]} | ${result[2]} |\n\n${resultMsg}\n💰 Saldo: $${user.balance.toLocaleString()}`,
            won > bet ? colors.success : (won > 0 ? colors.warning : colors.error)
        );

        await interaction.reply({ embeds: [embed] });
    }
};