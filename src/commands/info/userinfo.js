const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Informações de um usuário')
        .addUserOption(option => option.setName('user').setDescription('Usuário (opcional)').setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.resolve(target);

        const embed = createEmbed(
            `👤 ${target.username}`,
            `**🆔 ID:** \`${target.id}\`\n` +
            `**📅 Conta criada:** <t:${Math.floor(target.createdTimestamp / 1000)}:R>\n` +
            (member ? `**📅 Entrou no servidor:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n**🎭 Cargos:** ${member.roles.cache.size - 1}\n` : '') +
            `**🤖 Bot:** ${target.bot ? 'Sim' : 'Não'}`,
            colors.premium,
            target.displayAvatarURL({ dynamic: true, size: 512 })
        );

        await interaction.reply({ embeds: [embed] });
    }
};
