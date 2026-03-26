const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Informações do Leonis'),
    async execute(interaction, client, commands) {
        const embed = createEmbed(
            '🤖 Sobre Leonis',
            `**✨ Versão:** 2.0 Supreme\n` +
            `**📊 Servidores:** ${client.guilds.cache.size}\n` +
            `**👥 Usuários:** ${client.users.cache.size.toLocaleString()}\n` +
            `**⚙️ Comandos:** ${commands ? commands.size : '?'}\n` +
            `**👑 Owner:** <@${config.ownerId}>\n` +
            `**📄 Licença:** MIT ✨`,
            config.color,
            client.user.displayAvatarURL({ dynamic: true, size: 512 })
        );

        await interaction.reply({ embeds: [embed] });
    }
};
