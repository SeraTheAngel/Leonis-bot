const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Cara ou coroa!')
        .addStringOption(option =>
            option.setName('aposta')
                .setDescription('Sua aposta')
                .setRequired(true)
                .addChoices(
                    { name: '🪙 Cara', value: 'cara' },
                    { name: '👑 Coroa', value: 'coroa' }
                )),
    async execute(interaction) {
        const choice = interaction.options.getString('aposta');
        const result = Math.random() < 0.5 ? 'cara' : 'coroa';
        const won = choice === result;

        const embed = createEmbed(
            '🪙 CARA OU COROA! 🪙',
            `**${interaction.user.username}** apostou: **${choice.toUpperCase()}**\n` +
            `**Resultado:** **${result.toUpperCase()}**\n` +
            `${won ? '🎉 VOCÊ GANHOU! 🏆' : '😅 Quase! Tente novamente!'}`,
            won ? colors.success : colors.warning,
            'https://media.giphy.com/media/l0HlBO7eyXzSZkJba/giphy.gif'
        );

        await interaction.reply({ embeds: [embed] });
    }
};
