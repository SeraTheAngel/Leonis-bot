const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('effects')
        .setDescription('Lista todos os efeitos de áudio disponíveis'),
    async execute(interaction) {
        const embed = createEmbed(
            '🎛️ EFEITOS DISPONÍVEIS',
            `Use \`/effect\` para aplicar um efeito:\n\n` +
            `🔥 \`bassboost\` — Graves reforçados\n` +
            `🌙 \`nightcore\` — Mais rápido e agudo\n` +
            `💿 \`vaporwave\` — Mais lento e grave\n` +
            `🎧 \`8d\` — Áudio 3D rotativo\n` +
            `🎤 \`karaoke\` — Remove vocal\n` +
            `📢 \`tremolo\` — Efeito tremulo\n` +
            `🎵 \`vibrato\` — Efeito vibrado\n` +
            `🔊 \`trebleboost\` — Agudos reforçados\n` +
            `🔄 \`clear\` — Remove todos os efeitos\n\n` +
            `**Equalizador manual:** Use \`/eq\` para ajuste por frequência.`,
            colors.premium
        );
        await interaction.reply({ embeds: [embed] });
    }
};
