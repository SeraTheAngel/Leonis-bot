import { EmbedBuilder } from 'discord.js';

export function leonisEmbed({ title, description, color = 0x7c5cff, image, footer = 'Leonis • 🦁' } = {}) {
  const embed = new EmbedBuilder().setColor(color).setTimestamp().setFooter({ text: footer });
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (image) embed.setImage(image);
  return embed;
}

export const COLORS = { normal: 0x7c5cff, success: 0x57f287, warning: 0xfee75c, danger: 0xed4245, anime: 0xeb75ff };
