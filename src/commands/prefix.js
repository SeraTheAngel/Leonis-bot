import { EmbedBuilder } from 'discord.js';

export const PREFIX = process.env.PREFIX || 'l!';

export async function handlePrefixMessage(message, client) {
  if (!message.guild || message.author.bot || !message.content.startsWith(PREFIX)) return false;
  const parts = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const name = (parts.shift() || '').toLowerCase();
  if (!name) return false;

  if (name === 'ping') {
    const started = Date.now();
    const sent = await message.reply({ embeds: [new EmbedBuilder().setColor(0x7c5cff).setTitle('🏓 Pong!').setDescription('Calculando a latência...').setFooter({ text: 'Leonis • 🦁' })] });
    const roundTrip = Date.now() - started;
    const embed = new EmbedBuilder().setColor(0x57f287).setTitle('🏓 Pong!').setDescription(`💓 **Latência:** ${roundTrip}ms\n🌐 **API do Discord:** ${client.ws.ping}ms\n⚡ **Status:** Operacional`).setFooter({ text: 'Leonis • 🦁' }).setTimestamp();
    await sent.edit({ embeds: [embed] });
    return true;
  }

  if (name === 'leonis' || name === 'help' || name === 'ajuda') {
    await message.reply({ embeds: [new EmbedBuilder().setColor(0x7c5cff).setTitle('🦁 Leonis').setDescription(`Use **/${name === 'leonis' ? 'leonis' : 'ping'}** ou os comandos com prefixo **${PREFIX}**.\n\n🏓 **${PREFIX}ping** — Ver latência\n🦁 **${PREFIX}leonis** — Informações do bot\n❓ **${PREFIX}help** — Ajuda`).setFooter({ text: 'Leonis • 🦁' }).setTimestamp() }] });
    return true;
  }
  return false;
}
