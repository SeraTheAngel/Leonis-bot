// job.js
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');
const { JOBS, getUser, saveUser } = require('../../economy/system');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('Escolha ou veja seu emprego')
        .addStringOption(o =>
            o.setName('emprego').setDescription('Novo emprego').setRequired(false)
             .addChoices(
                { name: '💻 Programador ($250/h)',  value: 'programador' },
                { name: '📺 Youtuber ($180/h)',     value: 'youtuber' },
                { name: '🎥 Streamer ($220/h)',     value: 'streamer' },
                { name: '🎨 Artista ($150/h)',      value: 'artista' },
                { name: '⛏️ Mineiro ($120/h)',      value: 'mineiro' },
                { name: '👨‍🍳 Chef ($160/h)',        value: 'chef' },
             )),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        const newJob = interaction.options.getString('emprego');

        if (!newJob) {
            const current = user.job ? `${JOBS[user.job].emoji} **${user.job}** — $${JOBS[user.job].salary}/h` : 'Desempregado 😴';
            const lista = Object.entries(JOBS)
                .map(([name, d]) => `${d.emoji} \\`${name}\` — $${d.salary}/h`)
                .join('\n');
            return interaction.reply({ embeds: [createEmbed('⚒️ EMPREGOS', `**Seu emprego:** ${current}\n\n**Disponíveis:**\n${lista}\n\nUse `/job emprego:` para mudar!`, colors.info)] });
        }

        user.job = newJob;
        saveUser(interaction.user.id, user);

        const embed = createEmbed(
            `${JOBS[newJob].emoji} EMPREGADO!`,
            `Agora você é **${newJob}**!\n💰 Salário: $${JOBS[newJob].salary} base por trabalho\nUse `/work` para ganhar!`,
            colors.success
        );

        await interaction.reply({ embeds: [embed] });
    }
};