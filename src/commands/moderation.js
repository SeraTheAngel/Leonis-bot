import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { leonisEmbed, COLORS } from '../systems/embeds.js';
import { getGuildConfig, updateGuildConfig } from '../systems/storage.js';

const durationMs = value => {
  const match = /^([0-9]+)(s|m|h|d)$/i.exec(value);
  if (!match) return null;
  return Number(match[1]) * { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2].toLowerCase()];
};

const protectedTarget = (i, member) => {
  if (!member) return false;
  if (member.id === i.guild.ownerId) return true;
  return i.user.id !== i.guild.ownerId && member.roles.highest.position >= i.member.roles.highest.position;
};

export const moderationCommands = [
  {
    data: new SlashCommandBuilder().setName('ban').setDescription('Bane um membro.').setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)).addStringOption(o => o.setName('motivo').setDescription('Motivo')),
    async execute(i) {
      const user = i.options.getUser('usuário', true); const member = await i.guild.members.fetch(user.id).catch(() => null);
      if (protectedTarget(i, member) || !member?.bannable) return i.reply({ embeds: [leonisEmbed({ title: '🛡️ Ação bloqueada', description: 'Não vou permitir uma ação contra alguém protegido pela hierarquia do servidor.', color: COLORS.danger })], ephemeral: true });
      const reason = i.options.getString('motivo') ?? 'Sem motivo informado'; await member.ban({ reason });
      await i.reply({ embeds: [leonisEmbed({ title: '🔨 Ban aplicado', description: `**${user.tag}** foi banido.\n**Motivo:** ${reason}`, color: COLORS.danger })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('kick').setDescription('Expulsa um membro.').setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)).addStringOption(o => o.setName('motivo').setDescription('Motivo')),
    async execute(i) {
      const user = i.options.getUser('usuário', true); const member = await i.guild.members.fetch(user.id).catch(() => null);
      if (protectedTarget(i, member) || !member?.kickable) return i.reply({ embeds: [leonisEmbed({ title: '🛡️ Ação bloqueada', description: 'Esse membro está protegido pela hierarquia/permissões.', color: COLORS.danger })], ephemeral: true });
      const reason = i.options.getString('motivo') ?? 'Sem motivo informado'; await member.kick(reason);
      await i.reply({ embeds: [leonisEmbed({ title: '👢 Expulsão aplicada', description: `**${user.tag}** foi expulso.\n**Motivo:** ${reason}`, color: COLORS.warning })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('timeout').setDescription('Coloca ou remove timeout.').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)).addStringOption(o => o.setName('duração').setDescription('10s, 5m, 2h, 7d ou 0 para remover').setRequired(true)).addStringOption(o => o.setName('motivo').setDescription('Motivo')),
    async execute(i) {
      const user = i.options.getUser('usuário', true); const member = await i.guild.members.fetch(user.id).catch(() => null); const raw = i.options.getString('duração', true);
      if (protectedTarget(i, member) || !member?.moderatable) return i.reply({ embeds: [leonisEmbed({ title: '🛡️ Ação bloqueada', description: 'Não consigo moderar esse membro.', color: COLORS.danger })], ephemeral: true });
      if (raw === '0') { await member.timeout(null, i.options.getString('motivo') ?? 'Timeout removido'); return i.reply({ embeds: [leonisEmbed({ title: '🔊 Timeout removido', description: `**${user.tag}** voltou a poder falar.`, color: COLORS.success })] }); }
      const ms = durationMs(raw); if (!ms || ms > 28 * 86_400_000) return i.reply({ embeds: [leonisEmbed({ title: '❌ Duração inválida', description: 'Use 10s, 5m, 2h ou 7d, com máximo de 28 dias.', color: COLORS.danger })], ephemeral: true });
      await member.timeout(ms, i.options.getString('motivo') ?? 'Leonis timeout');
      await i.reply({ embeds: [leonisEmbed({ title: '🔇 Timeout aplicado', description: `**${user.tag}** ficará em timeout por **${raw}**.`, color: COLORS.warning })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('warn').setDescription('Adverte um membro e salva o histórico.').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)).addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true)),
    async execute(i) {
      const user = i.options.getUser('usuário', true); const member = await i.guild.members.fetch(user.id).catch(() => null);
      if (protectedTarget(i, member)) return i.reply({ embeds: [leonisEmbed({ title: '🛡️ Warn bloqueado', description: 'Não vou registrar um warn contra um membro protegido.', color: COLORS.danger })], ephemeral: true });
      const reason = i.options.getString('motivo', true); updateGuildConfig(i.guild.id, g => { g.warns ??= {}; g.warns[user.id] ??= []; g.warns[user.id].push({ moderatorId: i.user.id, moderatorTag: i.user.tag, reason, at: new Date().toISOString() }); });
      const count = getGuildConfig(i.guild.id).warns[user.id].length;
      await i.reply({ embeds: [leonisEmbed({ title: '⚠️ Warn registrado', description: `**${user.tag}** recebeu um warn.\n**Motivo:** ${reason}\n**Total:** ${count}`, color: COLORS.warning })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('warns').setDescription('Consulta os warns de um membro.').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers).addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)),
    async execute(i) {
      const user = i.options.getUser('usuário', true); const warns = getGuildConfig(i.guild.id).warns?.[user.id] ?? [];
      const description = warns.length ? warns.slice(-10).map((w, n) => `**${n + 1}.** ${w.reason}\n> por ${w.moderatorTag} • <t:${Math.floor(new Date(w.at).getTime() / 1000)}:R>`).join('\n') : 'Nenhum warn registrado.';
      await i.reply({ embeds: [leonisEmbed({ title: `⚠️ Histórico de ${user.tag}`, description, color: warns.length ? COLORS.warning : COLORS.success })], ephemeral: true });
    },
  },
  {
    data: new SlashCommandBuilder().setName('clear-warns').setDescription('Apaga o histórico de warns de um membro.').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild).addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true)),
    async execute(i) {
      const user = i.options.getUser('usuário', true); updateGuildConfig(i.guild.id, g => { if (g.warns) delete g.warns[user.id]; });
      await i.reply({ embeds: [leonisEmbed({ title: '🧹 Histórico limpo', description: `Os warns de **${user.tag}** foram removidos.`, color: COLORS.success })], ephemeral: true });
    },
  },
];
