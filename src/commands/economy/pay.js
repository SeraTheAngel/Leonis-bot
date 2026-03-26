// pay.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getUser, saveUser, updateNetworth } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfere dinheiro para outro usuário')
        .addUserOption(o => o.setName('usuario').setDescription('Quem vai receber').setRequired(true))
        .addIntegerOption(o => o.setName('valor').setDescription('Quanto transferir').setRequired(true).setMinValue(1)),
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('valor');
        const sender = getUser(interaction.user.id);

        if (target.id === interaction.user.id) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Você não pode pagar a si mesmo!', colors.error)], ephemeral: true });
        }
        if (target.bot) {
            return interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não pode transferir para bots!', colors.error)], ephemeral: true });
        }
        if (sender.balance < amount) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem saldo', `Você tem $${sender.balance.toLocaleString()}.`, colors.error)], ephemeral: true });
        }

        const receiver = getUser(target.id);
        sender.balance -= amount;
        receiver.balance += amount;
        saveUser(interaction.user.id, sender);
        saveUser(target.id, receiver);
        updateNetworth(interaction.user.id);
        updateNetworth(target.id);

        const embed = createEmbed(
            '💸 TRANSFERÊNCIA REALIZADA',
            `<@${interaction.user.id}> enviou **$${amount.toLocaleString()}** para <@${target.id}>! 💵\n\n` +
            `💰 Seu saldo: $${sender.balance.toLocaleString()}`,
            colors.success,
            null,
            target.displayAvatarURL({ dynamic: true })
        );

        await interaction.reply({ embeds: [embed] });
    }
};