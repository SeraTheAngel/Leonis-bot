import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  Collection,
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();

const blockedInvite = /(?:discord(?:app)?\.com\/invite\/|discord\.gg\/)/i;
const recentMessages = new Map();

function logLine(guild, text) {
  console.log(`[${guild?.name ?? 'DM'}] ${text}`);
}

client.once(Events.ClientReady, (bot) => {
  console.log(`🦁 Leonis online como ${bot.user.tag}`);
  console.log('🛡️ Núcleo de segurança carregado.');
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild || message.author.bot) return;

  // Anti-invite básico. Futuramente será configurável por servidor.
  if (blockedInvite.test(message.content)) {
    try {
      await message.delete();
      await message.channel.send({
        content: `🛡️ ${message.author}, convites de outros servidores não são permitidos aqui.`,
      });
    } catch (error) {
      console.error('Anti-invite:', error);
    }
    logLine(message.guild, `Invite bloqueado: ${message.author.tag}`);
    return;
  }

  // Anti-flood inicial: thresholds serão configuráveis por servidor.
  const now = Date.now();
  const key = `${message.guild.id}:${message.author.id}`;
  const entries = (recentMessages.get(key) ?? []).filter((time) => now - time < 8_000);
  entries.push(now);
  recentMessages.set(key, entries);

  if (entries.length >= 7) {
    try {
      await message.member.timeout(10_000, 'Leonis anti-flood');
    } catch (error) {
      console.error('Anti-flood:', error);
    }
  }
});

client.on(Events.GuildMemberAdd, (member) => {
  logLine(member.guild, `Membro entrou: ${member.user.tag}`);
});

client.on(Events.GuildMemberRemove, (member) => {
  logLine(member.guild, `Membro saiu: ${member.user?.tag ?? member.id}`);
});

client.on(Events.MessageDelete, (message) => {
  if (message.guild) {
    logLine(
      message.guild,
      `Mensagem apagada: ${message.author?.tag ?? 'desconhecido'} | ${message.content ?? '[conteúdo indisponível]'}`,
    );
  }
});

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
  if (newMessage.guild && oldMessage.content !== newMessage.content) {
    logLine(
      newMessage.guild,
      `Mensagem editada: ${newMessage.author?.tag ?? 'desconhecido'} | ${oldMessage.content ?? '[indisponível]'} -> ${newMessage.content ?? '[indisponível]'}`,
    );
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const payload = {
      content: '❌ O Leonis tropeçou feio aqui. Tenta novamente em alguns segundos.',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN não configurado. Use um arquivo .env local.');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
