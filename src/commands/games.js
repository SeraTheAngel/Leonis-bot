import { SlashCommandBuilder } from 'discord.js';
import { leonisEmbed, COLORS } from '../systems/embeds.js';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const card=()=>{const r=['A','2','3','4','5','6','7','8','9','10','J','Q','K'],s=['♠️','♥️','♦️','♣️'];return {r:pick(r),s:pick(s)}};
const val=cs=>{let n=0,a=0;for(const c of cs){n+=['J','Q','K'].includes(c.r)?10:c.r==='A'?11:Number(c.r);if(c.r==='A')a++}while(n>21&&a--)n-=10;return n};
const resultEmbed=(title,description)=>({embeds:[leonisEmbed({title,description,color:COLORS.anime})]});
export const gameCommands=[
 {data:new SlashCommandBuilder().setName('cara-ou-coroa').setDescription('Jogue cara ou coroa.'),async execute(i){await i.reply(resultEmbed('🪙 Cara ou Coroa',`Caiu **${pick(['CARA','COROA'])}**!`))}},
 {data:new SlashCommandBuilder().setName('dados').setDescription('Role dados.').addIntegerOption(o=>o.setName('lados').setDescription('2 a 100').setMinValue(2).setMaxValue(100)),async execute(i){const s=i.options.getInteger('lados')??6;await i.reply(resultEmbed('🎲 Dados',`Você rolou **${1+Math.floor(Math.random()*s)}** em um d${s}.`))}},
 {data:new SlashCommandBuilder().setName('blackjack').setDescription('Jogue Blackjack contra o Leonis.'),async execute(i){const p=[card(),card()],d=[card(),card()],pv=val(p),dv=val(d);const w=pv>21?'💥 Você estourou!':dv>21?'🎉 Leonis estourou!':pv>dv?'🏆 Você ganhou!':pv<dv?'💀 Leonis ganhou!':'🤝 Empate!';await i.reply(resultEmbed('🃏 Blackjack',`Você: ${p.map(c=>c.r+c.s).join(' ')} = **${pv}**\nLeonis: ${d.map(c=>c.r+c.s).join(' ')} = **${dv}**\n\n${w}`))}},
 {data:new SlashCommandBuilder().setName('cacaniquel').setDescription('Gire a caça-níquel virtual.'),async execute(i){const r=[pick(['🍒','🍋','⭐','💎','7️⃣']),pick(['🍒','🍋','⭐','💎','7️⃣']),pick(['🍒','🍋','⭐','💎','7️⃣'])],win=r.every(x=>x===r[0]);await i.reply(resultEmbed('🎰 Caça-Níquel',`**${r.join(' │ ')}**\n\n${win?'💰 JACKPOT!':'😔 Não foi dessa vez.'}`))}},
 {data:new SlashCommandBuilder().setName('roleta').setDescription('Roleta virtual: vermelho, preto ou verde.'),async execute(i){const n=Math.floor(Math.random()*37),color=n===0?'🟢 Verde':n%2?'🔴 Vermelho':'⚫ Preto';await i.reply(resultEmbed('🎡 Roleta',`A roleta parou no **${n}** — ${color}.`))}},
 {data:new SlashCommandBuilder().setName('campo-minado').setDescription('Descubra uma casa segura no campo minado.'),async execute(i){const safe=Math.random()>0.25;await i.reply(resultEmbed('💣 Campo Minado',safe?'🟩 Você encontrou uma casa segura!':'💥 BOOM! Você pisou numa mina!'))}},
 {data:new SlashCommandBuilder().setName('truco').setDescription('Simule uma rodada de truco virtual.'),async execute(i){await i.reply(resultEmbed('🃏 Truco',`A rodada começou! **${pick(['Você ganhou a mão!','Leonis pediu 6!','Você pediu truco!','Leonis levou a mão!'])}**`))}},
];
