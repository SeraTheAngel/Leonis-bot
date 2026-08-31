import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getAnimeGif } from '../systems/gifs.js';

const actions = {
  abraçar: ['hug', 'abraçou', false],
  beijar: ['kiss', 'beijou', false],
  cafuné: ['pat', 'fez cafuné em', false],
  tapa: ['slap', 'deu um tapa em', true],
  soco: ['bonk', 'deu um soco em', true],
  chutar: ['yeet', 'chutou', true],
  beliscar: ['poke', 'beliscou', true],
  morder: ['bite', 'mordeu', true],
  carinho: ['cuddle', 'fez carinho em', false],
  dançar: ['dance', 'dançou com', false],
  sorrir: ['smile', 'sorriu para', false],
  acenar: ['wave', 'acena para', false],
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
    const [gifType, verb, aggressive] = actions[type];
    const ownerId = process.env.OWNER_ID;

    if (aggressive && ownerId && target.id === ownerId && interaction.user.id !== ownerId) {
      const gif = await getAnimeGif('angry');
      const embed = new EmbedBuilder()
        .setTitle('🦁🚨 NEM PENSA!')
        .setDescription(`**${interaction.user}**, essa ação foi negada.\n\nVocê tentou **${type}** contra a criadora do Leonis. O próprio Leonis entrou na briga. 😾👊`)
        .setImage(gif)
        .setFooter({ text: 'Leonis • Proteção da criadora' });
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const gif = await getAnimeGif(gifType);
    const embed = new EmbedBuilder()
      .setTitle(`🦁 ${type.charAt(0).toUpperCase() + type.slice(1)}`)
      .setDescription(`**${interaction.user}** ${verb} **${target}**!`)
      .setImage(gif)
      .setFooter({ text: 'Leonis • GIF de anime' });

    await interaction.reply({ embeds: [embed] });
  },
};
