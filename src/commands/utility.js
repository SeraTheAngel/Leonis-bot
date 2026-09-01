import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { leonisEmbed, COLORS } from '../systems/embeds.js';
import { addKeyword, removeKeyword, getGuildConfig, updateGuildConfig } from '../systems/storage.js';

export const utilityCommands = [
  {
    data: new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do Leonis.'),
    async execute(interaction) {
      const api = interaction.client.ws.ping;
      const started = Date.now();
      await interaction.reply({ embeds: [leonisEmbed({ title: '🏓 Pong!', description: 'Calculando a latência...', color: COLORS.normal })], fetchReply: true });
      const roundTrip = Date.now() - started;
      await interaction.editReply({ embeds: [leonisEmbed({ title: '🏓 Pong!', description: `💓 **Latência:** ${roundTrip}ms\n🌐 **API do Discord:** ${api}ms\n⚡ **Status:** Operacional`, color: COLORS.success })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('leonis').setDescription('Mostra informações do Leonis.'),
    async execute(interaction) {
      await interaction.reply({ embeds: [leonisEmbed({ title: '🦁 Leonis', description: 'Bot multifuncional de segurança, moderação, diversão e administração.\n\n🛡️ Segurança • 🎌 Diversão • 🔨 Moderação • 👑 Administração', color: COLORS.normal })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('keyword-add').setDescription('Faz o Leonis reagir quando uma palavra aparecer.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addStringOption(o => o.setName('palavra').setDescription('Palavra ou termo a detectar.').setRequired(true))
      .addStringOption(o => o.setName('resposta').setDescription('Resposta opcional do Leonis.').setRequired(false)),
    async execute(i) {
      const word = i.options.getString('palavra', true).trim();
      if (word.length < 2 || word.length > 80) return i.reply({ embeds: [leonisEmbed({ title: '❌ Palavra inválida', description: 'Use entre 2 e 80 caracteres.', color: COLORS.danger })], ephemeral: true });
      addKeyword(i.guild.id, word, i.options.getString('resposta'));
      await i.reply({ embeds: [leonisEmbed({ title: '🔑 Palavra-chave adicionada', description: `Agora vou detectar **${word}** automaticamente.`, color: COLORS.success })] });
    },
  },
  {
    data: new SlashCommandBuilder().setName('keyword-remove').setDescription('Remove uma palavra-chave.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addStringOption(o => o.setName('palavra').setDescription('Palavra a remover.').setRequired(true)),
    async execute(i) {
      const word = i.options.getString('palavra', true);
      const removed = removeKeyword(i.guild.id, word);
      await i.reply({ embeds: [leonisEmbed({ title: removed ? '🗑️ Palavra removida' : '🔎 Não encontrada', description: removed ? `**${word}** não será mais detectada.` : `Não encontrei **${word}** na configuração.`, color: removed ? COLORS.success : COLORS.warning })], ephemeral: true });
    },
  },
  {
    data: new SlashCommandBuilder().setName('keyword-list').setDescription('Lista as palavras-chave configuradas.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(i) {
      const list = getGuildConfig(i.guild.id).keywords;
      const description = list.length ? list.map((k, n) => `${n + 1}. **${k.trigger}**${k.response ? ` → ${k.response}` : ''}`).join('\n') : 'Nenhuma palavra-chave configurada.';
      await i.reply({ embeds: [leonisEmbed({ title: '🔑 Palavras-chave', description, color: COLORS.normal })], ephemeral: true });
    },
  },
  {
    data: new SlashCommandBuilder().setName('config-logs').setDescription('Define o canal de logs do Leonis.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addChannelOption(o => o.setName('canal').setDescription('Canal onde os logs serão enviados.').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(i) {
      const channel = i.options.getChannel('canal', true);
      updateGuildConfig(i.guild.id, g => { g.logs.channelId = channel.id; });
      await i.reply({ embeds: [leonisEmbed({ title: '📜 Logs configurados', description: `Os logs serão enviados para ${channel}.`, color: COLORS.success })], ephemeral: true });
    },
  },
  {
    data: new SlashCommandBuilder().setName('config-welcome').setDescription('Configura as boas-vindas do Leonis.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addChannelOption(o => o.setName('canal').setDescription('Canal das boas-vindas.').addChannelTypes(ChannelType.GuildText).setRequired(true))
      .addBooleanOption(o => o.setName('ativado').setDescription('Ativar ou desativar.').setRequired(true))
      .addStringOption(o => o.setName('mensagem').setDescription('Use {user} para mencionar o membro.').setRequired(false)),
    async execute(i) {
      const channel = i.options.getChannel('canal', true);
      const enabled = i.options.getBoolean('ativado', true);
      const message = i.options.getString('mensagem');
      updateGuildConfig(i.guild.id, g => { g.welcome = { enabled, channelId: channel.id, message: message ?? g.welcome.message }; });
      await i.reply({ embeds: [leonisEmbed({ title: enabled ? '👋 Boas-vindas ativadas' : '👋 Boas-vindas desativadas', description: enabled ? `Canal: ${channel}\nMensagem: **${message ?? 'mantida'}**` : `O sistema continuará configurado, mas ficará desativado.`, color: enabled ? COLORS.success : COLORS.warning })], ephemeral: true });
    },
  },
];
