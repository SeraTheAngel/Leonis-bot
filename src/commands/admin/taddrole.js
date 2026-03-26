const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('taddrole')
        .setDescription('Adiciona cargo temporariamente')
        .addUserOption(option => option.setName('user').setDescription('Membro').setRequired(true))
        .addRoleOption(option => option.setName('cargo').setDescription('Cargo').setRequired(true))
        .addIntegerOption(option => option.setName('tempo').setDescription('Tempo em minutos').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Cargos"', colors.error)], ephemeral: true });
        }

        const target = interaction.guild.members.resolve(interaction.options.getUser('user'));
        if (!target) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Membro não encontrado!', colors.error)], ephemeral: true });

        const role = interaction.options.getRole('cargo');
        const time = interaction.options.getInteger('tempo');
        const reason = interaction.options.getString('motivo') || 'Cargo temporário';

        try {
            await target.roles.add(role, reason);

            setTimeout(async () => {
                try {
                    await target.roles.remove(role, 'Cargo temporário expirado');
                } catch (e) {
                    console.log('Erro ao remover cargo temporário:', e.message);
                }
            }, time * 60 * 1000);

            const embed = createEmbed(
                '⏳ CARGO TEMPORÁRIO',
                `**${role.name}** adicionado a **${target.user.tag}**\n` +
                `**⏱️ Expira em:** ${time} minutos\n**📝 Motivo:** ${reason}`,
                colors.info,
                config.gifs.pat[Math.floor(Math.random() * 2)]
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'taddrole', target.user, interaction.user, reason);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível adicionar cargo temporário!', colors.error)], ephemeral: true });
        }
    }
};