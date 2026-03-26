const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const skipped = queue.songs[0];
        try {
            await queue.skip();
            await interaction.reply({ embeds: [createEmbed('⏭️ PULADO', `**${skipped.name}** foi pulada! 🎶`, colors.info)] });
        } catch {
            await interaction.reply({ embeds: [createEmbed('⏭️ FIM DA FILA', 'Era a última música da fila!', colors.warning)] });
        }
    }
};
