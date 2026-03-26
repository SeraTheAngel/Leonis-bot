const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Desbloqueia o canal atual'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para usar este comando!', colors.error)], ephemeral: true });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
            const embed = createEmbed('🔓 Canal Desbloqueado', 'O canal foi desbloqueado com sucesso!', colors.success);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível desbloquear o canal!', colors.error)], ephemeral: true });
        }
    }
};