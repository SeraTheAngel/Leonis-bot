import { AuditLogEvent, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, updateGuildConfig } from './storage.js';

const buckets = new Map();
const LIMITS = { [AuditLogEvent.ChannelDelete]: 3, [AuditLogEvent.RoleDelete]: 3, [AuditLogEvent.MemberBanAdd]: 5, [AuditLogEvent.MemberKick]: 5, [AuditLogEvent.ChannelCreate]: 6, [AuditLogEvent.RoleCreate]: 6 };

function hit(guildId, executorId, type) {
  const key = `${guildId}:${executorId}:${type}`;
  const now = Date.now();
  const list = (buckets.get(key) ?? []).filter(t => now - t < 15_000);
  list.push(now); buckets.set(key, list);
  return list.length;
}

export async function protectFromNuke(guild, type, executor) {
  const config = getGuildConfig(guild.id).security;
  if (!config.antiNuke || !executor || executor.bot || executor.id === guild.ownerId) return false;
  const member = await guild.members.fetch(executor.id).catch(() => null);
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return false;

  const limit = LIMITS[type];
  if (!limit || hit(guild.id, executor.id, type) < limit) return false;

  try { await member.roles.set([], 'Leonis anti-nuke: atividade destrutiva em massa'); } catch {}
  updateGuildConfig(guild.id, g => { g.security.incidents ??= []; g.security.incidents.push({ type, executorId: executor.id, at: new Date().toISOString() }); g.security.incidents = g.security.incidents.slice(-50); });
  return true;
}

export { LIMITS };
