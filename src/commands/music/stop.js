const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e limpa a fila'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        await queue.stop();
        await interaction.reply({ embeds: [createEmbed('⏹️ PARADO', 'Música parada e fila limpa!', colors.warning)] });
    }
};
