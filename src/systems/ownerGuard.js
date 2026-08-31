import { EmbedBuilder } from 'discord.js';
import { getAnimeGif } from './gifs.js';

const aggressive = new Set(['tapa', 'soco', 'chutar', 'beliscar', 'morder']);

export async function protectCreator(interaction, action, target) {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId || target.id !== ownerId || !aggressive.has(action)) return false;
  const gif = await getAnimeGif('angry');
  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('🦁🚨 EI! MEXE COM A CRIADORA NÃO!')
    .setDescription(`**${interaction.user}** tentou usar **${action}** contra a criadora do Leonis.\n\n**Leonis:** “Com ela você não mexe. 😾👊”\n\nEntão o Leonis revidou e protegeu a criadora.`)
    .setImage(gif)
    .setFooter({ text: 'Leonis • Guarda da Criadora' })
    .setTimestamp();
  await interaction.reply({ embeds: [embed] });
  return true;
}
