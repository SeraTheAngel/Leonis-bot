const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockchannel')
        .setDescription('Bloqueia o canal atual (mensagens e reações)')
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do lock')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Canais"', colors.error)], ephemeral: true });
        }

        const reason = interaction.options.getString('motivo') || 'Canal bloqueado';

        try {
            await interaction.channel.permissionOverwrites.edit(
                interaction.guild.roles.everyone,
                { SendMessages: false, AddReactions: false },
                { reason }
            );

            const embed = createEmbed(
                '🔒 CANAL BLOQUEADO',
                `Este canal foi **bloqueado**!\n**📝 Motivo:** ${reason}\n**👮 Responsável:** ${interaction.user.tag}`,
                colors.warning,
                'https://media.giphy.com/media/3o7TKsQ8J2y5hJF0Ao/giphy.gif'
            );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível bloquear o canal!', colors.error)], ephemeral: true });
        }
    }
};