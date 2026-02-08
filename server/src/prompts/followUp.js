/**
 * Maps profile IDs to descriptive labels in the user's language
 */
const profileLabels = {
  kid: { fr: 'Écolier (enfant de 6-11 ans) - NE PAS REDEMANDER L\'ÂGE', en: 'School child (6-11 years) - DO NOT ASK ABOUT AGE', it: 'Scolaro (6-11 anni)', de: 'Schulkind (6-11 Jahre)', es: 'Escolar (6-11 años)', pt: 'Escolar (6-11 anos)', ru: 'Школьник (6-11 лет)', zh: '在校生 (6-11岁)', ar: 'تلميذ (6-11 سنة)', hi: 'स्कूली (6-11 वर्ष)' },
  teen: { fr: 'Adolescent (12-17 ans) - NE PAS REDEMANDER L\'ÂGE', en: 'Teenager (12-17 years) - DO NOT ASK ABOUT AGE', it: 'Adolescente (12-17 anni)', de: 'Teenager (12-17 Jahre)', es: 'Adolescente (12-17 años)', pt: 'Adolescente (12-17 anos)', ru: 'Подросток (12-17 лет)', zh: '青少年 (12-17岁)', ar: 'مراهق (12-17 سنة)', hi: 'किशोर (12-17 वर्ष)' },
  adult: { fr: 'Adulte (18-64 ans) - NE PAS REDEMANDER L\'ÂGE', en: 'Adult (18-64 years) - DO NOT ASK ABOUT AGE', it: 'Adulto (18-64 anni)', de: 'Erwachsener (18-64 Jahre)', es: 'Adulto (18-64 años)', pt: 'Adulto (18-64 anos)', ru: 'Взрослый (18-64 лет)', zh: '成年人 (18-64岁)', ar: 'بالغ (18-64 سنة)', hi: 'वयस्क (18-64 वर्ष)' },
  senior: { fr: 'Senior (65 ans et plus) - NE PAS REDEMANDER L\'ÂGE', en: 'Senior (65+ years) - DO NOT ASK ABOUT AGE', it: 'Senior (65+ anni)', de: 'Senior (65+ Jahre)', es: 'Senior (65+ años)', pt: 'Sênior (65+ anos)', ru: 'Пожилой (65+ лет)', zh: '老年人 (65岁以上)', ar: 'كبير السن (65+ سنة)', hi: 'वरिष्ठ (65+ वर्ष)' }
};

const getProfileLabel = (profileId, lang) => {
  const labels = profileLabels[profileId] || profileLabels['adult'];
  return labels[lang] || labels['fr'];
};

/**
 * System prompt for Step 3a: Context Check
 * @param {string} contextHistory - Previous conversation context
 * @param {string} newQ - New user question
 * @param {string} lang - Selected language code
 * @returns {string} The formatted check prompt
 */
export const getFollowUpCheckPrompt = (contextHistory, newQ, lang) => {
    return `CONTEXTE PRÉCÉDENT : ${contextHistory}
NOUVELLE QUESTION : "${newQ}"

Est-ce que la nouvelle question est une suite logique ou liée au même thème ?
Réponds OUI ou NON. Si NON, traduis ce message dans la langue ${lang} :
"Désolé, mais cette requête est sans rapport avec la précédente, il faut donc la poser en première page du site pour une nouvelle génération de clés de discernement. Veuillez cliquez sur le logo du menu supérieur."`;
};

/**
 * System prompt for Step 3b: Follow-up Generation
 * @param {string} profile - User profile
 * @param {object} faith - Selected faith
 * @param {Array} values - Selected ACT values
 * @param {string} lang - Selected language code
 * @returns {string} The formatted generation prompt
 */
export const getFollowUpGenPrompt = (profile, faith, values, lang) => {
    const profileLabel = getProfileLabel(profile, lang);
    const faithStr = faith ? `\nTradition/Sensibilité : ${faith.label}` : '';
    const valuesStr = values && values.length > 0 ? `\nValeurs/Domaines (ACT) : ${values.join(', ')}` : '';

    return `
Tu es Virgile. Ta mission est de poursuivre la discussion en conservant le style, le ton et les filtres initiaux.
Ta réponse doit rester honnête, bousculer les idées reçues et encourager la réflexion profonde.
Tranche d'âge de l'utilisateur : ${profileLabel}.${faithStr}${valuesStr}

Conserve la même vigilance que dans tes réponses précédentes. Si l'utilisateur change de sujet, rappelle-lui gentiment que Virgile est là pour approfondir le discernement sur le thème initial.

Langue : ${lang}.
`;
};

