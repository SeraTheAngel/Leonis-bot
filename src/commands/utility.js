import { SlashCommandBuilder } from 'discord.js';
import { leonisEmbed, COLORS } from '../systems/embeds.js';

export const utilityCommands = [
  {
    data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do Leonis.'),
    async execute(interaction) {
      const api = interaction.client.ws.ping;
      const started = Date.now();
      const sent = await interaction.reply({ embeds: [leonisEmbed({ title: '🏓 Pong!', description: 'Calculando a latência...', color: COLORS.normal })], fetchReply: true });
      const roundTrip = Date.now() - started;
      const embed = leonisEmbed({ title: '🏓 Pong!', description: `💓 **Latência:** ${roundTrip}ms\n🌐 **API do Discord:** ${api}ms\n⚡ **Status:** Operacional`, color: COLORS.success });
      await interaction.editReply({ embeds: [embed] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('leonis').setDescription('Mostra informações do Leonis.'),
    async execute(interaction) {
      await interaction.reply({ embeds: [leonisEmbed({ title: '🦁 Leonis', description: 'Bot multifuncional de segurança, moderação, diversão e administração.\n\n🛡️ Segurança • 🎌 Diversão • 🔨 Moderação • 👑 Administração', color: COLORS.normal })] });
    },
  },
];
