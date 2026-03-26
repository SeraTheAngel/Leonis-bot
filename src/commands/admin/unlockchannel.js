const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlockchannel')
        .setDescription('Desbloqueia o canal atual')
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do unlock')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Canais"', colors.error)], ephemeral: true });
        }

        const reason = interaction.options.getString('motivo') || 'Canal desbloqueado';

        try {
            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: null, AddReactions: null },
                { reason }
            );

            const embed = createEmbed(
                '🔓 CANAL LIBERADO',
                `Este canal foi **liberado**!\n**📝 Motivo:** ${reason}\n**👮 Responsável:** ${interaction.user.tag}`,
                colors.success,
                config.gifs.hug[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível liberar o canal!', colors.error)], ephemeral: true });
        }
    }
};