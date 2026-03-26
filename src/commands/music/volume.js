const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Ajusta o volume (0 a 100)')
        .addIntegerOption(o =>
            o.setName('nivel').setDescription('Nível de volume').setRequired(true).setMinValue(0).setMaxValue(100)),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const vol = interaction.options.getInteger('nivel');
        queue.setVolume(vol);

        const bar = '🔊'.repeat(Math.round(vol / 10)) + '🔈'.repeat(10 - Math.round(vol / 10));
        await interaction.reply({ embeds: [createEmbed('🔊 VOLUME', `${bar}\n**${vol}%**`, colors.info)] });
    }
};
