import { Client, GatewayIntentBits } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error('DISCORD_TOKEN is not configured.');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const timer = setTimeout(() => {
  console.error('Discord connection test timed out.');
  process.exit(1);
}, 60000);

autoShutdown();

async function autoShutdown() {
  client.once('ready', async () => {
    clearTimeout(timer);
    console.log(`Discord connection successful. Logged in as ${client.user.tag}.`);
    console.log(`Guilds visible to the bot: ${client.guilds.cache.size}.`);
    await client.destroy();
    process.exit(0);
  });

  client.on('error', error => {
    console.error(`Discord client error: ${error.message}`);
  });

  try {
    await client.login(token);
  } catch (error) {
    clearTimeout(timer);
    console.error(`Discord login failed: ${error.message}`);
    process.exit(1);
  }
}
