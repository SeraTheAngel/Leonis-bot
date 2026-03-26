const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors, config } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Mostra o prefixo atual do bot'),
    async execute(interaction, client) {
        const currentPrefix = client.prefixes?.get(interaction.guild.id) || config.prefix;

        const embed = createEmbed(
            '📝 PREFIXO ATUAL',
            `**Prefixo:** \`${currentPrefix}\`\n**Slash Commands:** \`/\` (recomendado)\n**Dica:** Use \`/setprefix\` para alterar!`,
            colors.premium
        );

        await interaction.reply({ embeds: [embed] });
    }
};
