const { SlashCommandBuilder } = require('discord.js');
const { translate } = require('@vitalets/google-translate-api');
const { createEmbed } = require('../../utils');
const { colors } = require('../../config');

const langNames = {
    af: 'Africâner', sq: 'Albanês', am: 'Amárico', ar: 'Árabe',
    hy: 'Armênio', az: 'Azerbaijano', eu: 'Basco', be: 'Bielorrusso',
    bn: 'Bengali', bs: 'Bósnio', bg: 'Búlgaro', ca: 'Catalão',
    ceb: 'Cebuano', zh: 'Chinês (Simplificado)', 'zh-tw': 'Chinês (Tradicional)',
    co: 'Corso', hr: 'Croata', cs: 'Tcheco', da: 'Dinamarquês',
    nl: 'Holandês', en: 'Inglês', eo: 'Esperanto', et: 'Estoniano',
    fi: 'Finlandês', fr: 'Francês', fy: 'Frísio', gl: 'Galego',
    ka: 'Georgiano', de: 'Alemão', el: 'Grego', gu: 'Gujarati',
    ht: 'Crioulo Haitiano', ha: 'Hauçá', haw: 'Havaiano', he: 'Hebraico',
    hi: 'Hindi', hmn: 'Hmong', hu: 'Húngaro', is: 'Islandês',
    ig: 'Igbo', id: 'Indonésio', ga: 'Irlandês', it: 'Italiano',
    ja: 'Japonês', jw: 'Javanês', kn: 'Canarês', kk: 'Cazaque',
    km: 'Khmer', ko: 'Coreano', ku: 'Curdo', ky: 'Quirguiz',
    lo: 'Laosiano', la: 'Latim', lv: 'Letão', lt: 'Lituano',
    lb: 'Luxemburguês', mk: 'Macedônio', mg: 'Malgaxe', ms: 'Malaio',
    ml: 'Malaiala', mt: 'Maltês', mi: 'Maori', mr: 'Marata',
    mn: 'Mongol', my: 'Birmanês', ne: 'Nepali', no: 'Norueguês',
    ny: 'Nianja', ps: 'Pashto', fa: 'Persa', pl: 'Polonês',
    pt: 'Português', pa: 'Punjabi', ro: 'Romeno', ru: 'Russo',
    sm: 'Samoano', gd: 'Gaélico Escocês', sr: 'Sérvio', st: 'Sesoto',
    sn: 'Shona', sd: 'Sindi', si: 'Cingalês', sk: 'Eslovaco',
    sl: 'Esloveno', so: 'Somali', es: 'Espanhol', su: 'Sundanês',
    sw: 'Suaíli', sv: 'Sueco', tl: 'Filipino', tg: 'Tadjique',
    ta: 'Tâmil', te: 'Telugu', th: 'Tailandês', tr: 'Turco',
    uk: 'Ucraniano', ur: 'Urdu', uz: 'Uzbeque', vi: 'Vietnamita',
    cy: 'Galês', xh: 'Xhosa', yi: 'Iídiche', yo: 'Iorubá', zu: 'Zulu'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Traduz texto para qualquer idioma (detecção automática da origem)')
        .addStringOption(option =>
            option.setName('texto')
                .setDescription('Texto para traduzir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('idioma')
                .setDescription('Código do idioma de destino (ex: en, es, ja, fr, de, ru, ko, zh...)')
                .setRequired(true)
                .addChoices(
                    { name: '🇺🇸 Inglês (en)',                  value: 'en' },
                    { name: '🇧🇷 Português (pt)',               value: 'pt' },
                    { name: '🇪🇸 Espanhol (es)',                value: 'es' },
                    { name: '🇫🇷 Francês (fr)',                 value: 'fr' },
                    { name: '🇩🇪 Alemão (de)',                  value: 'de' },
                    { name: '🇮🇹 Italiano (it)',                value: 'it' },
                    { name: '🇯🇵 Japonês (ja)',                 value: 'ja' },
                    { name: '🇰🇷 Coreano (ko)',                 value: 'ko' },
                    { name: '🇨🇳 Chinês Simpl. (zh)',          value: 'zh' },
                    { name: '🇷🇺 Russo (ru)',                   value: 'ru' },
                    { name: '🇸🇦 Árabe (ar)',                   value: 'ar' },
                    { name: '🇮🇳 Hindi (hi)',                   value: 'hi' },
                    { name: '🇹🇷 Turco (tr)',                   value: 'tr' },
                    { name: '🇳🇱 Holandês (nl)',               value: 'nl' },
                    { name: '🇸🇪 Sueco (sv)',                   value: 'sv' },
                    { name: '🇵🇱 Polonês (pl)',                 value: 'pl' },
                    { name: '🇺🇦 Ucraniano (uk)',               value: 'uk' },
                    { name: '🇹🇭 Tailandês (th)',               value: 'th' },
                    { name: '🇻🇳 Vietnamita (vi)',              value: 'vi' },
                    { name: '🇮🇩 Indonésio (id)',               value: 'id' },
                    { name: '🇮🇱 Hebraico (he)',                value: 'he' },
                    { name: '🇬🇷 Grego (el)',                   value: 'el' },
                    { name: '🇷🇴 Romeno (ro)',                  value: 'ro' },
                    { name: '🇵🇹 Galego (gl)',                  value: 'gl' },
                    { name: '🌐 Latim (la)',                    value: 'la' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const text = interaction.options.getString('texto');
        const targetLang = interaction.options.getString('idioma');
        const langName = langNames[targetLang] || targetLang.toUpperCase();

        try {
            const result = await translate(text, { to: targetLang });
            const detectedLang = result.raw?.src || 'auto';
            const detectedName = langNames[detectedLang] || detectedLang.toUpperCase();

            const embed = createEmbed(
                `🌐 Tradução → ${langName}`,
                `**🔍 Idioma detectado:** ${detectedName}\n\n` +
                `**📝 Original:**\n${text}\n\n` +
                `**✨ Traduzido:**\n${result.text}`,
                colors.success
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao traduzir:', error.message);
            const embed = createEmbed(
                '❌ Erro na Tradução',
                'Não foi possível traduzir o texto. Tente novamente em instantes.',
                colors.error
            );
            await interaction.editReply({ embeds: [embed] });
        }
    }
};