const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Sai do canal de voz e para a música'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não estou em nenhum canal ou nenhuma música tocando!', colors.error)], ephemeral: true });
        }

        await queue.stop();
        try {
            if (interaction.guild.members.me?.voice?.channel) {
                await interaction.guild.members.me.voice.disconnect();
            }
        } catch {}
        await interaction.reply({ embeds: [createEmbed('👋 ATÉ MAIS!', 'Saí do canal de voz. Até a próxima! 🎵', colors.warning)] });
    }
};
