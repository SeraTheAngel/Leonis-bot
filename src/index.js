import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Events, Collection, AuditLogEvent } from 'discord.js';
import { actionCommand } from './commands/actions.js';
import { utilityCommands } from './commands/utility.js';
import { moderationCommands } from './commands/moderation.js';
import { adminCommands } from './commands/admin.js';
import { gameCommands } from './commands/games.js';
import { economyCommands } from './commands/economy.js';
import { recordMessage, recordMemberEvent, getGuildConfig, findKeyword } from './systems/storage.js';
import { isBlockedInvite } from './systems/security.js';
import { protectFromNuke } from './systems/antiNuke.js';
import { leonisEmbed, COLORS } from './systems/embeds.js';
import { handlePrefixMessage } from './commands/prefix.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration], partials: [Partials.Message, Partials.Channel, Partials.GuildMember] });
client.commands = new Collection();
[actionCommand, ...utilityCommands, ...moderationCommands, ...adminCommands, ...gameCommands, ...economyCommands].forEach(c => client.commands.set(c.data.name, c));
const recentMessages = new Map(); const joinBursts = new Map();

async function sendLog(guild, { title, description, color = COLORS.normal }) {
  const channelId = getGuildConfig(guild.id).logs.channelId; if (!channelId) return;
  const channel = guild.channels.cache.get(channelId) ?? await guild.channels.fetch(channelId).catch(() => null); if (!channel?.isTextBased()) return;
  await channel.send({ embeds: [leonisEmbed({ title, description, color })] }).catch(() => {});
}

client.once(Events.ClientReady, bot => console.log(`🦁 Leonis online como ${bot.user.tag} • ${client.commands.size} comandos • prefixo ${process.env.PREFIX || 'l!'}`));

client.on(Events.MessageCreate, async m => {
  if (!m.guild || m.author.bot) return;
  const c = getGuildConfig(m.guild.id);
  if (c.security.blockInvites && isBlockedInvite(m.content)) {
    try { await m.delete(); } catch {}
    recordMessage(m, 'blocked-invite');
    await sendLog(m.guild, { title: '🛡️ Convite bloqueado', description: `Mensagem de **${m.author.tag}** removida em ${m.channel}.`, color: COLORS.warning }); return;
  }
  if (c.security.antiFlood) {
    const now = Date.now(), key = `${m.guild.id}:${m.author.id}`;
    const e = (recentMessages.get(key) || []).filter(t => now - t < 8000); e.push(now); recentMessages.set(key, e);
    if (e.length >= c.security.floodThreshold) try { await m.member.timeout(10000, 'Leonis anti-flood'); } catch {}
  }
  recordMessage(m, 'created');
  const keyword = findKeyword(m.guild.id, m.content);
  if (keyword) { try { await m.react('🦁'); } catch {} if (keyword.response) await m.reply({ embeds: [leonisEmbed({ title: '🦁 Leonis', description: keyword.response, color: COLORS.anime })] }).catch(() => {}); }
  try { await handlePrefixMessage(m, client); } catch (e) { console.error('Prefix command error:', e); }
});

client.on(Events.GuildMemberAdd, async m => {
  recordMemberEvent(m.guild.id, 'join', m.user.id, m.user.tag); const c = getGuildConfig(m.guild.id);
  if (c.welcome.enabled && c.welcome.channelId) {
    const channel = m.guild.channels.cache.get(c.welcome.channelId) ?? await m.guild.channels.fetch(c.welcome.channelId).catch(() => null);
    if (channel?.isTextBased()) { const text = c.welcome.message.replaceAll('{user}', `${m}`).replaceAll('{server}', m.guild.name); await channel.send({ embeds: [leonisEmbed({ title: '👋 Bem-vindo(a)!', description: text, image: m.user.displayAvatarURL({ size: 512 }), color: COLORS.success })] }).catch(() => {}); }
  }
  await sendLog(m.guild, { title: '📥 Membro entrou', description: `**${m.user.tag}** entrou.\nID: \`${m.user.id}\``, color: COLORS.success });
  if (!c.security.antiRaid) return;
  const now = Date.now(), e = (joinBursts.get(m.guild.id) || []).filter(t => now - t < 15000); e.push(now); joinBursts.set(m.guild.id, e);
  if (e.length >= c.security.joinThreshold) { try { await Promise.all(m.guild.channels.cache.map(ch => ch.isTextBased() ? ch.setRateLimitPerUser(10, 'Leonis anti-raid') : null)); } catch {} await sendLog(m.guild, { title: '🚨 Possível raid detectada', description: `**${e.length}** entradas em 15 segundos. Slowmode preventivo aplicado.`, color: COLORS.danger }); }
});

client.on(Events.GuildMemberRemove, async m => { recordMemberEvent(m.guild.id, 'leave', m.user?.id ?? m.id, m.user?.tag ?? m.id); await sendLog(m.guild, { title: '📤 Membro saiu', description: `**${m.user?.tag ?? m.id}** saiu.`, color: COLORS.warning }); });
client.on(Events.MessageDelete, async m => { if (!m.guild) return; recordMessage(m, 'deleted'); await sendLog(m.guild, { title: '🗑️ Mensagem apagada', description: `**Autor:** ${m.author?.tag ?? 'desconhecido'}\n**Canal:** ${m.channel}\n\n**Conteúdo:** ${m.content || '[texto não disponível no cache]'}\n\n**Anexos:** ${[...(m.attachments?.values?.() ?? [])].map(a => a.url).join('\n') || 'nenhum'}`, color: COLORS.warning }); });
client.on(Events.MessageUpdate, async (o, n) => { if (!n.guild || o.content === n.content) return; recordMessage(n, 'edited', o.content); await sendLog(n.guild, { title: '✏️ Mensagem editada', description: `**Autor:** ${n.author?.tag ?? 'desconhecido'}\n**Canal:** ${n.channel}\n\n**Antes:** ${o.content || '[vazio]'}\n**Depois:** ${n.content || '[vazio]'}`, color: COLORS.normal }); });

client.on(Events.ChannelCreate, ch => ch.guild && protectFromNuke(ch.guild, 'channel-create', ch.client));
client.on(Events.ChannelDelete, ch => ch.guild && protectFromNuke(ch.guild, 'channel-delete', ch.client));
client.on(Events.GuildRoleCreate, role => protectFromNuke(role.guild, 'role-create', role.client));
client.on(Events.GuildRoleDelete, role => protectFromNuke(role.guild, 'role-delete', role.client));

client.on(Events.InteractionCreate, async i => {
  if (!i.isChatInputCommand()) return; const c = client.commands.get(i.commandName); if (!c) return;
  try { await c.execute(i); } catch (e) { console.error(e); const p = { embeds: [leonisEmbed({ title: '❌ Erro', description: 'O Leonis tropeçou feio aqui. Tenta novamente.', color: COLORS.danger })], ephemeral: true }; if (i.replied || i.deferred) await i.followUp(p); else await i.reply(p); }
});

if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN não configurado.');
client.login(process.env.DISCORD_TOKEN);
