import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('data');
const file = path.join(dataDir, 'guilds.json');
fs.mkdirSync(dataDir, { recursive: true });

function load() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return {}; }
}

const db = load();

function save() {
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

export function getGuildConfig(guildId) {
  db[guildId] ??= {
    security: { blockInvites: true, antiFlood: true, antiRaid: true, floodThreshold: 7, joinThreshold: 8 },
    logs: { channelId: null },
    keywords: [],
    welcome: { enabled: false, channelId: null, message: 'Bem-vindo(a), {user}!' },
  };
  save();
  return db[guildId];
}

function serialiseMessage(message) {
  return {
    id: message.id,
    authorId: message.author?.id ?? null,
    authorTag: message.author?.tag ?? null,
    content: message.content ?? '[conteúdo indisponível]',
    attachments: [...(message.attachments?.values?.() ?? [])].map(a => ({ name: a.name, url: a.url, contentType: a.contentType })),
    timestamp: new Date().toISOString(),
  };
}

export function recordMessage(message, event, oldContent = null) {
  const guild = getGuildConfig(message.guild.id);
  guild.lastEvents ??= [];
  guild.lastEvents.push({ event, oldContent, message: serialiseMessage(message) });
  guild.lastEvents = guild.lastEvents.slice(-500);
  save();
}

export function recordMemberEvent(guildId, event, userId, tag) {
  const guild = getGuildConfig(guildId);
  guild.lastEvents ??= [];
  guild.lastEvents.push({ event, userId, tag, timestamp: new Date().toISOString() });
  guild.lastEvents = guild.lastEvents.slice(-500);
  save();
}
