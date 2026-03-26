// leaderboard.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getLeaderboard } = require('../../economy/system');

const medals = ['🥇', '🥈', '🥉'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Top 10 usuários mais ricos'),
    async execute(interaction) {
        const top = getLeaderboard();

        if (!top.length) {
            return interaction.reply({ embeds: [createEmbed('🏆 Leaderboard', 'Nenhum dado ainda! Use `/daily` e `/work` para começar.', colors.info)] });
        }

        const lista = top
            .map(([id, u], i) => `${medals[i] || `**${i + 1}.**`} <@${id}> — $${u.networth.toLocaleString()}`)
            .join('\n');

        const embed = createEmbed(
            '🏆 TOP 10 MAIS RICOS',
            lista,
            '#FFD700'
        );

        await interaction.reply({ embeds: [embed] });
    }
};