const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('np')
        .setDescription('Mostra a música tocando agora'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue.songs || !queue.songs.length) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });
        }

        const song = queue.songs[0];
        const filters = queue.filters?.names ? [...queue.filters.names] : [];

        const progress = Math.min(1, queue.currentTime / (song.duration || 1));
        const barLength = 20;
        const filled = Math.round(progress * barLength);
        const bar = '▓'.repeat(filled) + '░'.repeat(barLength - filled);

        const embed = createEmbed(
            '🎵 TOCANDO AGORA',
            `**[${song.name}](${song.url})**\n` +
            `👤 ${song.uploader?.name || 'Desconhecido'}\n\n` +
            `\`${bar}\`\n` +
            `⏱️ \`${formatTime(queue.currentTime || 0)}\` / \`${song.formattedDuration}\`\n\n` +
            `🔊 Volume: **${queue.volume}%**\n` +
            (filters.length ? `🎛️ Filtros: **${filters.join(', ')}**` : ''),
            colors.premium,
            song.thumbnail
        );

        await interaction.reply({ embeds: [embed] });
    }
};

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
