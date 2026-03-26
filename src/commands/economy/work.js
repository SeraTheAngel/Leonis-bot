// work.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { getUser, saveUser, updateNetworth, JOBS } = require('../../economy/system');

const workMessages = [
    'Você trabalhou duro e ganhou', 'Missão concluída! Recebeu',
    'Mais um dia de trabalho, lucrou', 'Seu esforço valeu', 'Salário caiu!'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Trabalhe e ganhe dinheiro (cooldown: 1h)'),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        const now = Date.now();
        const cooldown = 3600000;

        if (now - user.work < cooldown) {
            const diff = cooldown - (now - user.work);
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            return interaction.reply({ embeds: [createEmbed('⏰ Trabalho', `Descanse um pouco! Volte em **${m}m ${s}s**. ⌛`, colors.warning)], ephemeral: true });
        }

        const salary = JOBS[user.job]?.salary || 80;
        const reward = Math.floor(salary + Math.random() * (salary * 0.4));
        const jobLabel = user.job ? `${JOBS[user.job].emoji} como **${user.job}**` : 'como **freelancer** 💼';
        const msg = workMessages[Math.floor(Math.random() * workMessages.length)];

        user.balance += reward;
        user.work = now;
        user.xp += 25;
        saveUser(interaction.user.id, user);
        updateNetworth(interaction.user.id);

        const embed = createEmbed(
            '💼 TRABALHO',
            `${msg} **$${reward.toLocaleString()}** ${jobLabel}!\n💰 Saldo: $${user.balance.toLocaleString()}`,
            colors.success
        );

        await interaction.reply({ embeds: [embed] });
    }
};