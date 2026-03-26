const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um membro do servidor')
        .addUserOption(option => option.setName('user').setDescription('Usuário a ser banido').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do banimento')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para usar este comando!', colors.error)], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('motivo') || 'Não especificado';

        try {
            await interaction.guild.members.ban(user, { reason });
            const gif = config.gifs.punch[Math.floor(Math.random() * 2)];
            const embed = createEmbed('🔨 Membro Banido', `**${user.tag}** foi banido com sucesso!\n**Motivo:** ${reason}`, colors.success, gif);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível banir o membro!', colors.error)], ephemeral: true });
        }
    }
};