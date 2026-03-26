const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, logAction } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Cria um novo cargo')
        .addStringOption(option => option.setName('nome').setDescription('Nome do cargo').setRequired(true))
        .addStringOption(option => option.setName('cor').setDescription('Cor do cargo em hex (ex: #FF0000)').setRequired(false))
        .addBooleanOption(option => option.setName('menciona').setDescription('Cargo pode ser mencionado?').setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ embeds: [createEmbed('❌ Sem Permissão', 'Você precisa da permissão "Gerenciar Cargos"', colors.error)], ephemeral: true });
        }

        const name = interaction.options.getString('nome');
        const color = interaction.options.getString('cor') || '#FF6B9D';
        const mentionable = interaction.options.getBoolean('menciona') ?? true;

        try {
            const role = await interaction.guild.roles.create({
                name,
                color,
                mentionable,
                reason: `Criado por ${interaction.user.tag}`
            });

            const embed = createEmbed(
                '👑 CARGO CRIADO',
                `**${role.name}** foi criado!\n**🎨 Cor:** ${color}\n**🔔 Mencionável:** ${mentionable ? 'Sim' : 'Não'}\n**👮 Criador:** ${interaction.user.tag}`,
                color
            );
            await interaction.reply({ embeds: [embed] });
            logAction(interaction.guild, 'createrole', null, interaction.user, `Cargo: ${role.name}`);
        } catch (error) {
            await interaction.reply({ embeds: [createEmbed('❌ Erro', 'Não foi possível criar o cargo!', colors.error)], ephemeral: true });
        }
    }
};