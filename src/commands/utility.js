import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const utilityCommands = [
  {
    data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do Leonis.'),
    async execute(interaction) {
      await interaction.reply(`🏓 Pong! **${interaction.client.ws.ping}ms**`);
    },
  },
  {
    data: new SlashCommandBuilder().setName('leonis').setDescription('Mostra informações do Leonis.'),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle('🦁 Leonis')
        .setDescription('Bot multifuncional de segurança, moderação, diversão e administração.')
        .addFields(
          { name: '🛡️ Segurança', value: 'Anti-raid, anti-flood, proteção contra convites e futuras regras configuráveis.', inline: true },
          { name: '🎌 Diversão', value: 'Ações com GIFs de anime e minijogos.', inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
];
