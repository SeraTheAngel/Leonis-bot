const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Define slowmode no canal')
        .addIntegerOption(option =>
            option.setName('segundos')
                .setDescription('Tempo entre mensagens (0-21600)')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Canais"', colors.error)], ephemeral: true });
        }

        const seconds = interaction.options.getInteger('segundos');
        if (seconds < 0 || seconds > 21600) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Use um valor entre 0 e 21600 segundos (6 horas)!', colors.error)], ephemeral: true });
        }

        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            const embed = createEmbed(
                '🐌 SLOWMODE ATIVADO',
                seconds === 0
                    ? 'Slowmode **desativado**!'
                    : `Slowmode definido para **${seconds} segundos**!`,
                colors.info,
                'https://media.giphy.com/media/l0HlBO7eyXzSZkJba/giphy.gif'
            );
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível definir slowmode!', colors.error)], ephemeral: true });
        }
    }
};