import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Events, Collection } from 'discord.js';
import { actionCommand } from './commands/actions.js';
import { utilityCommands } from './commands/utility.js';
import { moderationCommands } from './commands/moderation.js';
import { gameCommands } from './commands/games.js';
import { recordMessage, recordMemberEvent, getGuildConfig } from './systems/storage.js';
import { isBlockedInvite } from './systems/security.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();
[actionCommand, ...utilityCommands, ...moderationCommands, ...gameCommands].forEach((command) => client.commands.set(command.data.name, command));

const recentMessages = new Map();
const joinBursts = new Map();

client.once(Events.ClientReady, (bot) => {
  console.log(`🦁 Leonis online como ${bot.user.tag}`);
  console.log(`⚙️ ${client.commands.size} comandos carregados.`);
  console.log('🛡️ Núcleo de segurança carregado.');
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild || message.author.bot) return;
  const config = getGuildConfig(message.guild.id);
  if (config.security.blockInvites && isBlockedInvite(message.content)) {
    try {
      await message.delete();
      await message.channel.send({ content: `🛡️ ${message.author}, convites de outros servidores não são permitidos aqui.` });
    } catch (error) { console.error('Anti-invite:', error); }
    recordMessage(message, 'blocked-invite');
    return;
  }
  if (config.security.antiFlood) {
    const now = Date.now();
    const key = `${message.guild.id}:${message.author.id}`;
    const entries = (recentMessages.get(key) ?? []).filter((time) => now - time < 8_000);
    entries.push(now); recentMessages.set(key, entries);
    if (entries.length >= config.security.floodThreshold) {
      try { await message.member.timeout(10_000, 'Leonis anti-flood'); } catch (error) { console.error('Anti-flood:', error); }
    }
  }
  recordMessage(message, 'created');
});

client.on(Events.GuildMemberAdd, async (member) => {
  recordMemberEvent(member.guild.id, 'join', member.user.id, member.user.tag);
  const config = getGuildConfig(member.guild.id);
  if (!config.security.antiRaid) return;
  const now = Date.now();
  const joins = (joinBursts.get(member.guild.id) ?? []).filter((time) => now - time < 15_000);
  joins.push(now); joinBursts.set(member.guild.id, joins);
  if (joins.length >= config.security.joinThreshold) {
    console.log(`[${member.guild.name}] 🚨 Possível raid: ${joins.length} entradas em 15s.`);
    try {
      await Promise.all(member.guild.channels.cache.map(async (channel) => channel.isTextBased() ? channel.setRateLimitPerUser(10, 'Leonis anti-raid') : null));
    } catch (error) { console.error('Anti-raid lockdown:', error); }
  }
});

client.on(Events.GuildMemberRemove, (member) => recordMemberEvent(member.guild.id, 'leave', member.user?.id ?? member.id, member.user?.tag ?? member.id));
client.on(Events.MessageDelete, (message) => { if (message.guild) recordMessage(message, 'deleted'); });
client.on(Events.MessageUpdate, (oldMessage, newMessage) => { if (newMessage.guild && oldMessage.content !== newMessage.content) recordMessage(newMessage, 'edited', oldMessage.content); });

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try { await command.execute(interaction); }
  catch (error) {
    console.error(error);
    const payload = { content: '❌ O Leonis tropeçou feio aqui. Tenta novamente em alguns segundos.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload); else await interaction.reply(payload);
  }
});

if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN não configurado. Use um arquivo .env local.');
client.login(process.env.DISCORD_TOKEN);
