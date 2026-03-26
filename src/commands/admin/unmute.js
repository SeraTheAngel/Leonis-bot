const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove o mute de um membro')
        .addUserOption(option => option.setName('user').setDescription('Membro a desmutar').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do unmute')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Timeout Members"', colors.error)], ephemeral: true });
        }

        const target = interaction.guild.members.resolve(interaction.options.getUser('user'));
        if (!target) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Membro não encontrado!', colors.error)], ephemeral: true });

        const reason = interaction.options.getString('motivo') || 'Não especificado';

        try {
            await target.timeout(null, reason);
            const embed = createEmbed(
                '🔊 UNMUTE APLICADO',
                `**${target.user.tag}** foi desmutado!\n` +
                `**📝 Motivo:** ${reason}\n` +
                `**👮 Moderador:** ${interaction.user.tag}`,
                colors.success,
                config.gifs.hug[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'unmute', target.user, interaction.user, reason);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível desmutar!', colors.error)], ephemeral: true });
        }
    }
};