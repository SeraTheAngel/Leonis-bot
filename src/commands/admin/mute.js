const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Silencia um membro')
        .addUserOption(option => option.setName('user').setDescription('Membro a silenciar').setRequired(true))
        .addIntegerOption(option =>
            option.setName('tempo').setDescription('Tempo em minutos (padrão: 60)').setRequired(false))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo')), 
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Timeout Members"', colors.error)], ephemeral: true });
        }

        const target = interaction.guild.members.resolve(interaction.options.getUser('user'));
        if (!target) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Membro não encontrado!', colors.error)], ephemeral: true });

        const time = interaction.options.getInteger('tempo') ?? 60;
        const reason = interaction.options.getString('motivo') || 'Não especificado';

        try {
            await target.timeout(time * 60 * 1000, reason);
            const embed = createEmbed(
                '🔇 MUTE APLICADO',
                `**${target.user.tag}** foi silenciado!\n` +
                `**⏱️ Tempo:** ${time} minutos\n` +
                `**📝 Motivo:** ${reason}\n` +
                `**👮 Moderador:** ${interaction.user.tag}`,
                colors.warning,
                config.gifs.pat[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'mute', target.user, interaction.user, reason);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível mutar o membro!', colors.error)], ephemeral: true });
        }
    }
};