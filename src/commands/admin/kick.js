const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um membro do servidor')
        .addUserOption(option => option.setName('user').setDescription('Usuário a ser expulso').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo do kick')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para usar este comando!', colors.error)], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('motivo') || 'Não especificado';

        try {
            await interaction.guild.members.kick(user, reason);
            const gif = config.gifs.kick[Math.floor(Math.random() * 2)];
            const embed = createEmbed('👢 Membro Expulso', `**${user.tag}** foi expulso com sucesso!\n**Motivo:** ${reason}`, colors.warning, gif);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível expulsar o membro!', colors.error)], ephemeral: true });
        }
    }
};