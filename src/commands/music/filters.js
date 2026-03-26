const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('Mostra os efeitos/filtros ativos'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const activeFilters = [...queue.filters.names];
        const status = activeFilters.length
            ? activeFilters.map(f => `🎛️ \`${f}\``).join('\n')
            : '✅ Nenhum filtro ativo — áudio puro';

        await interaction.reply({ embeds: [createEmbed('🎛️ FILTROS ATIVOS', status + '\n\nUse `/effect` para mudar ou `/effect clear` para remover todos.', colors.info)] });
    }
};
