const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens do canal')
        .addIntegerOption(option => option.setName('quantidade').setDescription('Quantidade de mensagens (1-100)').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para usar este comando!', colors.error)], ephemeral: true });
        }

        const amount = interaction.options.getInteger('quantidade');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Use um número entre 1 e 100!', colors.error)], ephemeral: true });
        }

        try {
            const messages = await interaction.channel.bulkDelete(amount, true);
            const embed = createEmbed('🧹 Canal Limpado', `✅ **${messages.size} mensagens** foram removidas!`, colors.success);
            const reply = await interaction.reply({ embeds: [embed], fetchReply: true });
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível limpar as mensagens!', colors.error)], ephemeral: true });
        }
    }
};