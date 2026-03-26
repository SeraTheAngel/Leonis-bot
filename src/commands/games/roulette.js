const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Aposta na roleta (vermelho/preto/verde)')
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('Cor para apostar')
                .setRequired(true)
                .addChoices(
                    { name: '🔴 Vermelho', value: 'red' },
                    { name: '⚫ Preto', value: 'black' },
                    { name: '🟢 Verde', value: 'green' }
                )),
    async execute(interaction) {
        const choice = interaction.options.getString('cor');
        const result = Math.random();
        const isRed = result < 0.48;
        const isBlack = result >= 0.48 && result < 0.96;
        const isGreen = result >= 0.96;

        const colorEmoji = isRed ? '🔴' : isBlack ? '⚫' : '🟢';
        const colorName = isRed ? 'VERMELHO' : isBlack ? 'PRETO' : 'VERDE';
        const won = (choice === 'red' && isRed) || (choice === 'black' && isBlack) || (choice === 'green' && isGreen);

        const embed = createEmbed(
            '🎰 ROLETA! 🎰',
            `**${interaction.user.username}** apostou em **${choice.toUpperCase()}**\n` +
            `**Resultado:** ${colorEmoji} **${colorName}**\n` +
            `${won ? '🎉 VOCÊ GANHOU! 💰' : '😢 Você perdeu... 💸'}`,
            won ? colors.success : colors.error,
            'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif'
        );

        await interaction.reply({ embeds: [embed] });
    }
};
