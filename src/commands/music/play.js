const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música ou playlist (YouTube, Spotify)')
        .addStringOption(o =>
            o.setName('musica').setDescription('Nome, link do YouTube ou Spotify').setRequired(true)),
    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Entre em um canal de voz primeiro!', colors.error)], ephemeral: true });
        }

        const query = interaction.options.getString('musica');
        await interaction.deferReply();

        try {
            await client.distube.play(voiceChannel, query, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction
            });
            await interaction.editReply({ embeds: [createEmbed('🔍 Buscando...', `Procurando: **${query}**`, colors.info)] });
        } catch (error) {
            console.error('[/play]', error.message);
            await interaction.editReply({ embeds: [createEmbed('❌ Erro', `Não consegui tocar: ${error.message.slice(0, 200)}`, colors.error)] });
        }
    }
};
