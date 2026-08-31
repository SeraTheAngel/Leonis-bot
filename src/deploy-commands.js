import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { actionCommand } from './commands/actions.js';
import { utilityCommands } from './commands/utility.js';
import { moderationCommands } from './commands/moderation.js';

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  throw new Error('Defina DISCORD_TOKEN e CLIENT_ID no .env');
}

const commands = [actionCommand, ...utilityCommands, ...moderationCommands].map(c => c.data.toJSON());
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
console.log(`✅ ${commands.length} comandos registrados globalmente.`);
