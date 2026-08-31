import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getAnimeGif } from '../systems/gifs.js';

const actions = {
  abraçar: ['hug', 'abraçou'],
  beijar: ['kiss', 'beijou'],
  cafuné: ['pat', 'fez cafuné em'],
  tapa: ['slap', 'deu um tapa em'],
  soco: ['bonk', 'deu um soco em'],
  chutar: ['yeet', 'chutou'],
  beliscar: ['poke', 'beliscou'],
  morder: ['bite', 'mordeu'],
  carinho: ['cuddle', 'fez carinho em'],
  dançar: ['dance', 'dançou com'],
  sorrir: ['smile', 'sorriu para'],
  acenar: ['wave', 'acena para'],
};

const choices = Object.entries(actions).map(([name]) => ({ name, value: name }));

export const actionCommand = {
  data: new SlashCommandBuilder()
    .setName('ação')
    .setDescription('Interaja com alguém usando um GIF de anime.')
    .addStringOption((option) => option.setName('tipo').setDescription('Tipo de ação').setRequired(true).addChoices(...choices))
    .addUserOption((option) => option.setName('usuário').setDescription('Quem vai receber a ação').setRequired(true)),

  async execute(interaction) {
    const type = interaction.options.getString('tipo', true);
    const target = interaction.options.getUser('usuário', true);
    const [gifType, verb] = actions[type];
    const gif = await getAnimeGif(gifType);

    const embed = new EmbedBuilder()
      .setDescription(`🦁 **${interaction.user}** ${verb} **${target}**!`)
      .setImage(gif)
      .setFooter({ text: 'Leonis • GIF de anime' });

    await interaction.reply({ embeds: [embed] });
  },
};
