// deposit.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getUser, saveUser, updateNetworth } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposita dinheiro no banco (taxa de 2%)')
        .addIntegerOption(o =>
            o.setName('valor').setDescription('Quanto depositar (ou -1 para tudo)').setRequired(true).setMinValue(-1)),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        let amount = interaction.options.getInteger('valor');

        if (amount === -1) amount = user.balance;

        if (amount <= 0 || user.balance < amount) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', `Saldo insuficiente! Você tem $${user.balance.toLocaleString()}.`, colors.error)], ephemeral: true });
        }

        const fee = Math.floor(amount * 0.02);
        const deposited = amount - fee;

        user.balance -= amount;
        user.bank += deposited;
        saveUser(interaction.user.id, user);
        updateNetworth(interaction.user.id);

        const embed = createEmbed(
            '🏦 DEPÓSITO REALIZADO',
            `Depositado: **$${deposited.toLocaleString()}**
` +
            `Taxa (2%): -$${fee.toLocaleString()}

` +
            `💵 Carteira: $${user.balance.toLocaleString()}
` +
            `🏦 Banco: $${user.bank.toLocaleString()}`,
            colors.info
        );

        await interaction.reply({ embeds: [embed] });
    }
};