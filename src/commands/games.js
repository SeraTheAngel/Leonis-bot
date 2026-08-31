import { SlashCommandBuilder } from 'discord.js';

const card = () => {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠️','♥️','♦️','♣️'];
  return { rank: ranks[Math.floor(Math.random() * ranks.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
};

const value = (cards) => {
  let total = 0; let aces = 0;
  for (const c of cards) { total += ['J','Q','K'].includes(c.rank) ? 10 : c.rank === 'A' ? 11 : Number(c.rank); if (c.rank === 'A') aces++; }
  while (total > 21 && aces--) total -= 10;
  return total;
};

export const gameCommands = [
  {
    data: new SlashCommandBuilder().setName('cara-ou-coroa').setDescription('Jogue cara ou coroa com moeda virtual.'),
    async execute(i) { await i.reply(`🪙 Caiu **${Math.random() < 0.5 ? 'CARA' : 'COROA'}**!`); },
  },
  {
    data: new SlashCommandBuilder().setName('dados').setDescription('Role dados.').addIntegerOption(o => o.setName('lados').setDescription('Número de lados (2–100)').setMinValue(2).setMaxValue(100)),
    async execute(i) { const sides = i.options.getInteger('lados') ?? 6; await i.reply(`🎲 Você rolou **${1 + Math.floor(Math.random() * sides)}** em um d${sides}.`); },
  },
  {
    data: new SlashCommandBuilder().setName('blackjack').setDescription('Jogue uma rodada simples de Blackjack contra o Leonis.'),
    async execute(i) {
      const player = [card(), card()]; const dealer = [card(), card()];
      const pv = value(player); const dv = value(dealer);
      const winner = pv > 21 ? '💥 Você estourou!' : dv > 21 ? '🎉 Leonis estourou! Você ganhou!' : pv > dv ? '🏆 Você ganhou!' : pv < dv ? '🤡 Leonis ganhou!' : '🤝 Empate!';
      await i.reply(`🃏 **Blackjack**\nVocê: ${player.map(c => `${c.rank}${c.suit}`).join(' ')} = **${pv}**\nLeonis: ${dealer.map(c => `${c.rank}${c.suit}`).join(' ')} = **${dv}**\n\n${winner}`);
    },
  },
];
