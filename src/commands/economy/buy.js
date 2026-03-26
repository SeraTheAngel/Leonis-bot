// buy.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, getAnimeGif } = require('../../utils');
const { colors } = require('../../config');
const { SHOP, getUser, saveUser, updateNetworth } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Compra um item da loja')
        .addStringOption(o =>
            o.setName('item').setDescription('Item para comprar').setRequired(true)
             .addChoices(
                { name: '⚔️ Espada ($500)',    value: 'espada' },
                { name: '🎒 Mochila ($1200)',  value: 'mochila' },
                { name: '👑 VIP ($2500)',       value: 'vip' },
                { name: '🎣 Pesca ($300)',      value: 'pesca' },
                { name: '🚗 Carro ($5000)',     value: 'carro' },
             )),
    async execute(interaction) {
        const item = interaction.options.getString('item');
        const itemData = SHOP[item];
        const user = getUser(interaction.user.id);

        if (user.inventory.includes(item)) {
            return interaction.reply({ embeds: [createEmbed('⚠️ Já possui', `Você já tem **${itemData.emoji} ${item}**!`, colors.warning)], ephemeral: true });
        }

        if (user.balance < itemData.price) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem saldo', `Precisa de **$${itemData.price.toLocaleString()}**. Você tem $${user.balance.toLocaleString()}.`, colors.error)], ephemeral: true });
        }

        user.balance -= itemData.price;
        user.inventory.push(item);
        saveUser(interaction.user.id, user);
        updateNetworth(interaction.user.id);

        const gif = await getAnimeGif('happy').catch(() => null);
        const embed = createEmbed(
            `✅ COMPRADO! ${itemData.emoji}`,
            `**${item.toUpperCase()}** adquirido por $${itemData.price.toLocaleString()}!
*${itemData.desc}*
💰 Saldo restante: $${user.balance.toLocaleString()}`,
            colors.success,
            gif
        );

        await interaction.reply({ embeds: [embed] });
    }
};