const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription('Remove cargo de um membro')
        .addUserOption(option => option.setName('user').setDescription('Membro').setRequired(true))
        .addRoleOption(option => option.setName('cargo').setDescription('Cargo a remover').setRequired(true))
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
            await target.roles.remove(role, reason);
            const embed = createEmbed(
                '➖ CARGO REMOVIDO',
                `**${role.name}** foi removido de **${target.user.tag}**\n**📝 Motivo:** ${reason}`,
                colors.warning,
                config.gifs.kick[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'removerole', target.user, interaction.user, reason);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível remover o cargo!', colors.error)], ephemeral: true });
        }
    }
};