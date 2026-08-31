import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const durationMs = (value) => {
  const match = /^([0-9]+)(s|m|h|d)$/i.exec(value);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2].toLowerCase()];
  return amount * unit;
};

export const moderationCommands = [
  {
    data: new SlashCommandBuilder().setName('ban').setDescription('Bane um membro.').setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true))
      .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(false)),
    async execute(i) {
      const user = i.options.getUser('usuário', true);
      const member = await i.guild.members.fetch(user.id).catch(() => null);
      if (!member?.bannable) return i.reply({ content: '❌ Não consigo banir esse membro (hierarquia/permissão).', ephemeral: true });
      await member.ban({ reason: i.options.getString('motivo') ?? 'Sem motivo informado' });
      await i.reply(`🔨 **${user.tag}** foi banido.`);
    },
  },
  {
    data: new SlashCommandBuilder().setName('kick').setDescription('Expulsa um membro.').setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true))
      .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(false)),
    async execute(i) {
      const user = i.options.getUser('usuário', true);
      const member = await i.guild.members.fetch(user.id).catch(() => null);
      if (!member?.kickable) return i.reply({ content: '❌ Não consigo expulsar esse membro.', ephemeral: true });
      await member.kick(i.options.getString('motivo') ?? 'Sem motivo informado');
      await i.reply(`👢 **${user.tag}** foi expulso.`);
    },
  },
  {
    data: new SlashCommandBuilder().setName('timeout').setDescription('Coloca um membro em timeout.').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true))
      .addStringOption(o => o.setName('duração').setDescription('Ex.: 10m, 2h, 7d').setRequired(true))
      .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(false)),
    async execute(i) {
      const user = i.options.getUser('usuário', true);
      const member = await i.guild.members.fetch(user.id).catch(() => null);
      const ms = durationMs(i.options.getString('duração', true));
      if (!member?.moderatable || !ms || ms > 28 * 86_400_000) return i.reply({ content: '❌ Duração inválida ou membro fora da minha hierarquia. Use até 28d.', ephemeral: true });
      await member.timeout(ms, i.options.getString('motivo') ?? 'Leonis timeout');
      await i.reply(`🔇 **${user.tag}** recebeu timeout por **${i.options.getString('duração', true)}**.`);
    },
  },
  {
    data: new SlashCommandBuilder().setName('warn').setDescription('Adverte um membro.').setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('usuário').setDescription('Membro').setRequired(true))
      .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true)),
    async execute(i) {
      const user = i.options.getUser('usuário', true);
      await i.reply(`⚠️ **${user.tag}** recebeu um warn. Motivo: ${i.options.getString('motivo', true)}`);
    },
  },
];
