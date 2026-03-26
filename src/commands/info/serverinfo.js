const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Informações completas do servidor'),
    async execute(interaction) {
        const guild = interaction.guild;
        const members = await guild.members.fetch();
        const humans = members.filter(m => !m.user.bot).size;
        const bots = members.filter(m => m.user.bot).size;
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;
        const roles = guild.roles.cache.size - 1;
        const boosts = guild.premiumSubscriptionCount || 0;
        const boostLevel = guild.premiumTier;

        const embed = createEmbed(
            `📊 ${guild.name}`,
            `**👥 Membros:** ${guild.memberCount.toLocaleString()} (👤 ${humans} | 🤖 ${bots})\n` +
            `**📺 Canais:** ${textChannels + voiceChannels} (💬 ${textChannels} | 🔊 ${voiceChannels} | 📁 ${categories})\n` +
            `**👑 Cargos:** ${roles}\n` +
            `**🚀 Boosts:** ${boosts} (Nível ${boostLevel})\n` +
            `**📅 Criado:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n` +
            `**👑 Dono:** <@${guild.ownerId}>\n` +
            `**🔗 ID:** \`${guild.id}\``,
            colors.info,
            guild.bannerURL({ dynamic: true, size: 2048 }) || guild.iconURL({ dynamic: true, size: 2048 }),
            guild.iconURL({ dynamic: true, size: 128 })
        );

        await interaction.reply({ embeds: [embed] });
    }
};
