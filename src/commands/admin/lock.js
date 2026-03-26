const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Bloqueia o canal atual'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para usar este comando!', colors.error)], ephemeral: true });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
            const embed = createEmbed('🔒 Canal Bloqueado', 'O canal foi bloqueado com sucesso!', colors.warning);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível bloquear o canal!', colors.error)], ephemeral: true });
        }
    }
};