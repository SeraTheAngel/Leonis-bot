// daily.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, getAnimeGif } = require('../../utils');
const { colors } = require('../../config');
const { getUser, saveUser, updateNetworth, MULTIPLIERS } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Recompensa diária (a cada 24h)'),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        const now = Date.now();
        const cooldown = 86400000;

        if (now - user.daily < cooldown) {
            const diff = cooldown - (now - user.daily);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            return interaction.reply({ embeds: [createEmbed('⏰ Daily', `Volte em **${h}h ${m}m**! ⌛`, colors.warning)], ephemeral: true });
        }

        const hasMochila = user.inventory.includes('mochila');
        const multiplier = hasMochila ? MULTIPLIERS.mochila : 1;
        const reward = Math.floor((100 + Math.random() * 400) * multiplier);

        user.balance += reward;
        user.daily = now;
        user.xp += 50;
        saveUser(interaction.user.id, user);
        updateNetworth(interaction.user.id);

        const gif = await getAnimeGif('happy').catch(() => null);
        const embed = createEmbed(
            '📅 DAILY RECEBIDO!',
            `+**$${reward.toLocaleString()}** adicionado à carteira! 💵
` +
            (hasMochila ? '🎒 **Mochila:** multiplicador x2 aplicado!' : ''),
            colors.success,
            gif
        );

        await interaction.reply({ embeds: [embed] });
    }
};