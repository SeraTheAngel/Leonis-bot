import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getEconomy, saveEconomy, addCoins } from '../systems/economy.js';

const money = (n) => `${n.toLocaleString('pt-BR')} 🪙`;

export const economyCommands = [
  { data: new SlashCommandBuilder().setName('saldo').setDescription('Veja seu saldo.'), async execute(i) { const e = getEconomy(i.guild.id, i.user.id); await i.reply({ embeds: [new EmbedBuilder().setTitle('💰 Saldo').setDescription(`Você possui **${money(e.balance)}**.`)] }); } },
  { data: new SlashCommandBuilder().setName('daily').setDescription('Receba sua recompensa diária.'), async execute(i) { const e = getEconomy(i.guild.id, i.user.id); const now = Date.now(); if (now - e.lastDaily < 86_400_000) return i.reply({ embeds: [new EmbedBuilder().setTitle('⏳ Daily').setDescription('Você já pegou sua recompensa hoje!')] }); e.lastDaily = now; addCoins(i.guild.id, i.user.id, 500); saveEconomy(); await i.reply({ embeds: [new EmbedBuilder().setTitle('🎁 Recompensa diária').setDescription('Você recebeu **500 🪙**!')] }); } },
  { data: new SlashCommandBuilder().setName('pagar').setDescription('Transfira moedas virtuais.').addUserOption(o=>o.setName('usuário').setDescription('Destinatário').setRequired(true)).addIntegerOption(o=>o.setName('quantia').setDescription('Quantidade').setMinValue(1).setRequired(true)), async execute(i) { const target=i.options.getUser('usuário',true); const amount=i.options.getInteger('quantia',true); const from=getEconomy(i.guild.id,i.user.id); if(target.id===i.user.id || from.balance<amount) return i.reply({embeds:[new EmbedBuilder().setTitle('❌ Transferência negada').setDescription('Saldo insuficiente ou destinatário inválido.')],ephemeral:true}); addCoins(i.guild.id,i.user.id,-amount); addCoins(i.guild.id,target.id,amount); saveEconomy(); await i.reply({embeds:[new EmbedBuilder().setTitle('💸 Transferência').setDescription(`**${i.user}** enviou **${money(amount)}** para **${target}**.`)]}); } },
];
