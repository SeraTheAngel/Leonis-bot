const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { EQ_BANDS } = require('../../music/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eq')
        .setDescription('Equalizador manual por frequência')
        .addStringOption(o =>
            o.setName('banda').setDescription('Frequência').setRequired(true)
             .addChoices(
                { name: '60Hz',   value: '60Hz' },
                { name: '150Hz',  value: '150Hz' },
                { name: '400Hz',  value: '400Hz' },
                { name: '1kHz',   value: '1kHz' },
                { name: '3.5kHz', value: '3.5kHz' },
                { name: '7kHz',   value: '7kHz' },
                { name: '12kHz',  value: '12kHz' },
                { name: '16kHz',  value: '16kHz' },
                { name: '20kHz',  value: '20kHz' },
                { name: '22kHz',  value: '22kHz' },
             ))
        .addIntegerOption(o =>
            o.setName('ganho').setDescription('Ganho em dB (-10 a +10)').setRequired(true).setMinValue(-10).setMaxValue(10)),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const band = interaction.options.getString('banda');
        const gain = interaction.options.getInteger('ganho');
        const ffmpegFilter = EQ_BANDS[band] + gain;

        queue.filters.set([ffmpegFilter]);

        const sign = gain > 0 ? `+${gain}` : `${gain}`;
        await interaction.reply({ embeds: [createEmbed('🎚️ EQUALIZADOR', `**${band}: ${sign}dB** aplicado!`, colors.info)] });
    }
};
