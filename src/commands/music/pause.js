const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa a música atual'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });
        if (queue.paused) return interaction.reply({ embeds: [createEmbed('⚠️ Aviso', 'A música já está pausada!', colors.warning)], ephemeral: true });

        queue.pause();
        await interaction.reply({ embeds: [createEmbed('⏸️ PAUSADO', `**${queue.songs[0].name}** foi pausada.`, colors.warning)] });
    }
};
