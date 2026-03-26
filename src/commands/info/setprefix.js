const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setprefix')
        .setDescription('Define o prefixo do bot para este servidor')
        .addStringOption(option =>
            option.setName('prefixo')
                .setDescription('Novo prefixo (máx 5 caracteres)')
                .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem alterar o prefixo!', colors.error)], ephemeral: true });
        }

        const newPrefix = interaction.options.getString('prefixo');
        if (newPrefix.length > 5) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'O prefixo deve ter no máximo 5 caracteres!', colors.error)], ephemeral: true });
        }

        client.prefixes.set(interaction.guild.id, newPrefix);

        const embed = createEmbed(
            '🔧 PREFIXO ALTERADO',
            `Novo prefixo: \`${newPrefix}\`\n**Nota:** Slash commands (\`/\`) continuam funcionando!`,
            colors.info
        );

        await interaction.reply({ embeds: [embed] });
    }
};
