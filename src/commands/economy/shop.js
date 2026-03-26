// shop.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { SHOP } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Exibe a loja de itens'),
    async execute(interaction) {
        const lista = Object.entries(SHOP)
            .map(([name, d]) => `${d.emoji} **${name}** — $${d.price.toLocaleString()}
┗ *${d.desc}*`)
            .join('\n\n');

        const embed = createEmbed(
            '🏪 LOJA LEONIS',
            lista + '\n\nUse `/buy` para comprar um item!','colors.premium'
        );

        await interaction.reply({ embeds: [embed] });
    }
};