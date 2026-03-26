const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Adiciona cargo a um membro')
        .addUserOption(option => option.setName('user').setDescription('Membro').setRequired(true))
        .addRoleOption(option => option.setName('cargo').setDescription('Cargo a adicionar').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo')), 
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Cargos"', colors.error)], ephemeral: true });
        }

        const target = interaction.guild.members.resolve(interaction.options.getUser('user'));
        if (!target) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Membro não encontrado!', colors.error)], ephemeral: true });

        const role = interaction.options.getRole('cargo');
        const reason = interaction.options.getString('motivo') || 'Não especificado';

        try {
            await target.roles.add(role, reason);
            const embed = createEmbed(
                '➕ CARGO ADICIONADO',
                `**${role.name}** foi adicionado a **${target.user.tag}**\n**📝 Motivo:** ${reason}`,
                colors.success,
                config.gifs.hug[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'addrole', target.user, interaction.user, reason);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível adicionar o cargo!', colors.error)], ephemeral: true });
        }
    }
};