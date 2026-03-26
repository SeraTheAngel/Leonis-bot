const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { FILTERS } = require('../../music/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('effect')
        .setDescription('Aplica um efeito de áudio')
        .addStringOption(o =>
            o.setName('efeito').setDescription('Efeito para aplicar').setRequired(true)
             .addChoices(
                { name: '🔥 Bassboost',   value: 'bassboost' },
                { name: '🌙 Nightcore',   value: 'nightcore' },
                { name: '💿 Vaporwave',   value: 'vaporwave' },
                { name: '🎧 8D Audio',    value: '8d' },
                { name: '🎤 Karaoke',     value: 'karaoke' },
                { name: '📢 Tremolo',     value: 'tremolo' },
                { name: '🎵 Vibrato',     value: 'vibrato' },
                { name: '🔊 Trebleboost', value: 'trebleboost' },
                { name: '🔄 Clear (reset)', value: 'clear' }
             )),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const effect = interaction.options.getString('efeito');

        try {
            if (effect === 'clear') {
                await queue.filters.clear();
                return interaction.reply({ embeds: [createEmbed('🔄 FILTROS REMOVIDOS', 'Todos os efeitos foram removidos!', colors.info)] });
            } else {
                await queue.filters.clear();
                await queue.filters.add(effect);
                const info = FILTERS?.[effect];
                return interaction.reply({ embeds: [createEmbed(`${info?.label || effect} ATIVADO!`, `Efeito **${info?.label || effect}** aplicado! 🎚️`, colors.success)] });
            }
        } catch (e) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível aplicar o efeito.', colors.error)], ephemeral: true });
        }
    }
};
