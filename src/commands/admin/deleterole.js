const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleterole')
        .setDescription('Deleta um cargo')
        .addRoleOption(option => option.setName('cargo').setDescription('Cargo a deletar').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Cargos"', colors.error)], ephemeral: true });
        }

        const role = interaction.options.getRole('cargo');
        if (role.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Você não pode deletar cargos iguais ou superiores ao seu!', colors.error)], ephemeral: true });
        }

        try {
            const roleName = role.name;
            await role.delete(`Deletado por ${interaction.user.tag}`);
            const embed = createEmbed(
                '🗑️ CARGO DELETADO',
                `**${roleName}** foi deletado!\n**👮 Responsável:** ${interaction.user.tag}`,
                colors.error,
                config.gifs.punch[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível deletar o cargo!', colors.error)], ephemeral: true });
        }
    }
};