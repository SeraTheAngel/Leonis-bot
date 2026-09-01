import { SlashCommandBuilder } from 'discord.js';
import { leonisEmbed, COLORS } from '../systems/embeds.js';
import { getEconomy, updateEconomy, getGuildEconomy } from '../systems/economy.js';

const money = n => `${Math.floor(n).toLocaleString('pt-BR')} 🪙`;
const card = (title, description, color = COLORS.normal) => ({ embeds: [leonisEmbed({ title, description, color })] });

export const economyCommands = [
  { data: new SlashCommandBuilder().setName('saldo').setDescription('Veja seu saldo ou o de outro membro.').addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(false)), async execute(i) {
    const user = i.options.getUser('usuário') ?? i.user; const e = getEconomy(i.guild.id, user.id);
    await i.reply(card('💰 Carteira', `**${user.tag}**\n\n🪙 Carteira: **${money(e.balance)}**\n🏦 Banco: **${money(e.bank)}**`));
  } },
  { data: new SlashCommandBuilder().setName('daily').setDescription('Receba sua recompensa diária.'), async execute(i) {
    const e = getEconomy(i.guild.id, i.user.id), now = Date.now(), cooldown = 86_400_000;
    if (now - e.lastDaily < cooldown) return i.reply({ ...card('⏳ Daily', `Você já recebeu sua recompensa. Volte em **${Math.ceil((cooldown - now + e.lastDaily) / 3_600_000)}h**.`, COLORS.warning), ephemeral: true });
    const reward = 250 + Math.floor(Math.random() * 251); updateEconomy(i.guild.id, i.user.id, x => { x.balance += reward; x.lastDaily = now; });
    await i.reply(card('🎁 Daily recebido!', `Você ganhou **${money(reward)}**!\n\nNovo saldo: **${money(getEconomy(i.guild.id, i.user.id).balance)}**`, COLORS.success));
  } },
  { data: new SlashCommandBuilder().setName('pagar').setDescription('Transfira moedas para outro membro.').addUserOption(o => o.setName('usuário').setDescription('Destinatário').setRequired(true)).addIntegerOption(o => o.setName('quantia').setDescription('Quantidade').setMinValue(1).setMaxValue(1_000_000).setRequired(true)), async execute(i) {
    const target = i.options.getUser('usuário', true), amount = i.options.getInteger('quantia', true), from = getEconomy(i.guild.id, i.user.id);
    if (target.bot || target.id === i.user.id) return i.reply({ ...card('❌ Transferência negada', 'Você precisa escolher outro membro real.', COLORS.danger), ephemeral: true });
    if (from.balance < amount) return i.reply({ ...card('💸 Saldo insuficiente', `Você tem apenas **${money(from.balance)}**.`, COLORS.danger), ephemeral: true });
    updateEconomy(i.guild.id, i.user.id, x => { x.balance -= amount; }); updateEconomy(i.guild.id, target.id, x => { x.balance += amount; });
    await i.reply(card('💸 Transferência realizada', `**${i.user}** enviou **${money(amount)}** para **${target}**.`, COLORS.success));
  } },
  { data: new SlashCommandBuilder().setName('ranking').setDescription('Veja os membros mais ricos do servidor.'), async execute(i) {
    const rows = Object.entries(getGuildEconomy(i.guild.id)).sort((a,b) => (b[1].balance + b[1].bank) - (a[1].balance + a[1].bank)).slice(0, 10);
    const text = rows.length ? rows.map(([id,e],n) => `**${n + 1}.** <@${id}> — **${money(e.balance + e.bank)}**`).join('\n') : 'Ainda não há dados de economia.';
    await i.reply(card('🏆 Ranking de riqueza', text, COLORS.anime));
  } },
];
