const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Retoma a música pausada'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música na fila!', colors.error)], ephemeral: true });
        if (!queue.paused) return interaction.reply({ embeds: [createEmbed('⚠️ Aviso', 'A música não está pausada!', colors.warning)], ephemeral: true });

        queue.resume();
        await interaction.reply({ embeds: [createEmbed('▶️ RETOMADO', `**${queue.songs[0].name}** voltou a tocar! 🎶`, colors.success)] });
    }
};
