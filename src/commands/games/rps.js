const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Pedra, Papel ou Tesoura!')
        .addStringOption(option =>
            option.setName('escolha')
                .setDescription('Sua escolha')
                .setRequired(true)
                .addChoices(
                    { name: '✊ Pedra', value: 'rock' },
                    { name: '📄 Papel', value: 'paper' },
                    { name: '✂️ Tesoura', value: 'scissors' }
                )),
    async execute(interaction) {
        const playerChoice = interaction.options.getString('escolha');
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * 3)];

        let result;
        if (playerChoice === botChoice) {
            result = '🤝 Empate!';
        } else if (
            (playerChoice === 'rock' && botChoice === 'scissors') ||
            (playerChoice === 'paper' && botChoice === 'rock') ||
            (playerChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = '🎉 Você ganhou!';
        } else {
            result = '😈 Leonis ganhou!';
        }

        const embedColor = result.includes('Você ganhou') ? colors.success
            : result.includes('Empate') ? colors.warning
            : colors.error;

        const embed = createEmbed(
            '✊📄✂️ PEDRA PAPEL TESOURA!',
            `**Você:** ${playerChoice.toUpperCase()}\n**Leonis:** ${botChoice.toUpperCase()}\n\n${result}`,
            embedColor,
            'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif'
        );

        await interaction.reply({ embeds: [embed] });
    }
};
