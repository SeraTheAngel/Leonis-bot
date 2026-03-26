const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

const gifMap = {
    1: '26tPpl7rTngHhXbCi',
    2: '3o7btPCcdNniyf0ArS',
    3: 'l0HlBO7eyXzSZkJba',
    4: 'JIX9t2j0ZTN9S',
    5: 'm0axgJvpIk1GO',
    6: 'ISO9h1D8G2IHI'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Rola um dado de 1 a 6'),
    async execute(interaction) {
        const roll = Math.floor(Math.random() * 6) + 1;
        const gif = `https://media.giphy.com/media/${gifMap[roll]}/giphy.gif`;
        const embed = createEmbed(
            '🎲 DADO ROLADO!',
            `**${interaction.user.username}** rolou: **${roll}** 🎯`,
            colors.info,
            gif
        );
        await interaction.reply({ embeds: [embed] });
    }
};
