const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Avatar em alta qualidade')
        .addUserOption(option => option.setName('user').setDescription('Usuário (opcional)').setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;

        const embed = createEmbed(
            `🖼️ Avatar de ${target.username}`,
            '**Clique na imagem para ver em tamanho original!**',
            colors.premium,
            target.displayAvatarURL({ dynamic: true, size: 2048 })
        );

        await interaction.reply({ embeds: [embed] });
    }
};