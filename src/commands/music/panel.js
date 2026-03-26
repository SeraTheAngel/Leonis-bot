const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Abre o painel interativo de controle de música'),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando!', colors.error)], ephemeral: true });

        const song = queue.songs[0];

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('music_pause').setLabel('⏸️ Pausar').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('music_resume').setLabel('▶️ Retomar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('music_skip').setLabel('⏭️ Pular').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('music_stop').setLabel('⏹️ Parar').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('music_queue').setLabel('📋 Fila').setStyle(ButtonStyle.Secondary),
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('music_fx_bassboost').setLabel('🔥 Bass').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('music_fx_nightcore').setLabel('🌙 Night').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('music_fx_8d').setLabel('🎧 8D').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('music_fx_vaporwave').setLabel('💿 Vapor').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('music_fx_clear').setLabel('🔄 Clear').setStyle(ButtonStyle.Secondary),
        );

        await interaction.reply({
            embeds: [createEmbed(
                '🎛️ PAINEL DE CONTROLE',
                `**Tocando:** [${song.name}](${song.url})\n**Duração:** ${song.formattedDuration}\n**Volume:** ${queue.volume}%`,
                colors.premium,
                song.thumbnail
            )],
            components: [row1, row2],
        });
    }
};
