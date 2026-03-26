// balance.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getUser, JOBS } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Mostra o saldo de um usuário')
        .addUserOption(o => o.setName('usuario').setDescription('Outro usuário (opcional)')),
    async execute(interaction) {
        const target = interaction.options.getUser('usuario') || interaction.user;
        const user = getUser(target.id);
        const job = user.job ? `${JOBS[user.job].emoji} ${user.job}` : 'Desempregado 😴';

        const embed = createEmbed(
            `💰 ${target.username}`,
            `**💵 Carteira:** $${user.balance.toLocaleString()}
` +
            `**🏦 Banco:** $${user.bank.toLocaleString()}
` +
            `**💎 Patrimônio:** $${user.networth.toLocaleString()}
` +
            `**⭐ Nível:** ${user.level}
` +
            `**⚒️ Emprego:** ${job}`,
            colors.premium,
            null,
            target.displayAvatarURL({ dynamic: true })
        );

        await interaction.reply({ embeds: [embed] });
    }
};