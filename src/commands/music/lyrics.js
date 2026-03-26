const { SlashCommandBuilder } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Busca a letra da música atual ou de uma específica')
        .addStringOption(o => o.setName('musica').setDescription('Nome da música (opcional)')),
    async execute(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id);
        const songName = interaction.options.getString('musica') || queue?.songs[0]?.name;

        if (!songName) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Nenhuma música tocando e nenhum nome informado!', colors.error)], ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const lyrics = await lyricsFinder(songName, '');

            if (!lyrics) {
                return interaction.editReply({ embeds: [createEmbed('😢 Não Encontrado', `Não achei a letra de **${songName}**.`, colors.warning)] });
            }

            const trimmed = lyrics.length > 3800 ? lyrics.slice(0, 3800) + '\n...' : lyrics;

            const embed = createEmbed(
                `📄 ${songName}`,
                trimmed,
                colors.premium
            );
            await interaction.editReply({ embeds: [embed] });
        } catch {
            await interaction.editReply({ embeds: [createEmbed('❌ Erro', 'Não foi possível buscar a letra!', colors.error)] });
        }
    }
};
