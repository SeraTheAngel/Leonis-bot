const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, formatUptime } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Latência completa do bot'),
    async execute(interaction, client) {
        const patGif = config.gifs.pat[Math.floor(Math.random() * 2)];
        const sent = await interaction.reply({
            embeds: [createEmbed('🏓 Pingando...', 'Calculando métricas...', colors.info, patGif)],
            fetchReply: true
        });

        const hugGif = config.gifs.hug[Math.floor(Math.random() * 2)];
        const embed = createEmbed(
            '🏓 PONG! ⚡',
            `**🌐 Latência WS:** ${Math.floor(client.ws.ping)}ms\n` +
            `**📨 Latência Bot:** ${sent.createdTimestamp - interaction.createdTimestamp}ms\n` +
            `**⏱️ Uptime:** ${formatUptime(client.uptime)}\n` +
            `**📊 Servidores:** ${client.guilds.cache.size}\n` +
            `**👥 Usuários:** ${client.users.cache.size.toLocaleString()}`,
            colors.success,
            hugGif
        );

        await interaction.editReply({ embeds: [embed] });
    }
};
