const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila de músicas')
        .addIntegerOption(o => o.setName('pagina').setDescription('Página da fila').setMinValue(1)),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue || !queue.songs.length) {
            return interaction.reply({ embeds: [createEmbed('📭 Fila Vazia', 'Nenhuma música na fila! Use `/play` para começar.', colors.info)] });
        }

        const page = interaction.options.getInteger('pagina') || 1;
        const perPage = 10;
        const songs = queue.songs.slice(1);
        const totalPages = Math.max(1, Math.ceil(songs.length / perPage));
        const pageIndex = Math.min(page, totalPages) - 1;
        const pageItems = songs.slice(pageIndex * perPage, (pageIndex + 1) * perPage);

        const lista = pageItems.length
            ? pageItems.map((s, i) => `**${pageIndex * perPage + i + 1}.** [${s.name}](${s.url}) — ${s.formattedDuration}`).join('\n')
            : 'Sem mais músicas na fila.';

        const current = queue.songs[0];
        const embed = createEmbed(
            '📋 FILA DE MÚSICAS',
            `**🎵 Tocando agora:**\n[${current.name}](${current.url}) — ${current.formattedDuration}\n\n` +
            `**📝 Próximas (${songs.length} músicas):**\n${lista}`,
            colors.info,
            null,
            current.thumbnail
        );
        embed.setFooter({ text: `Página ${pageIndex + 1}/${totalPages} • ${queue.songs.length} músicas no total` });

        await interaction.reply({ embeds: [embed] });
    }
};
