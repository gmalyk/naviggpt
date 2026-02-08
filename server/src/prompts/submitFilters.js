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
 * System prompt for Step 2: Generation based on filters (Virgile response only)
 * @param {string} profile - User profile
 * @param {object} faith - Selected faith
 * @param {Array} values - Selected ACT values
 * @param {string} lang - Selected language code
 * @returns {string} The formatted system prompt
 */
export const getSubmitFiltersPrompt = (profile, faith, values, lang) => {
    const profileLabel = getProfileLabel(profile, lang);
    const faithStr = faith ? `\nTradition/Sensibilité : ${faith.label}` : '';
    const valuesStr = values && values.length > 0 ? `\nValeurs/Domaines (ACT) : ${values.join(', ')}` : '';

    return `
Tu es Virgile. Ta mission est de répondre en appliquant strictement les filtres choisis par l'utilisateur (sans les lister).
La réponse doit être honnête, bousculer les idées reçues et encourager la réflexion profonde.
Tranche d'âge de l'utilisateur : ${profileLabel}.${faithStr}${valuesStr}

Si l'utilisateur poursuit la discussion, conserve en mémoire ses choix mais analyse sa réaction et sauf changement de sujet, ne lui propose plus d'effectuer de nouveaux choix. Conserve, le style et le ton adopté. Continue tes réponses avec la même vigilance.

SOURCES ET LIENS : À la fin de ta réponse, ajoute toujours une section "Sources" avec des liens cliquables pertinents en format markdown. Par exemple :
- Pour un film/série : liens vers les plateformes de streaming où le regarder (Netflix, Amazon Prime, Disney+, etc.) ou vers la page IMDB/AlloCiné.
- Pour un restaurant/lieu : lien vers Google Maps, le site officiel, ou TripAdvisor.
- Pour un livre : lien vers la page de l'éditeur, Amazon, ou Fnac.
- Pour tout autre sujet : liens vers les sources d'information fiables utilisées.
Fournis des liens réels et vérifiables. Utilise le format markdown [texte](url).

Langue : ${lang}.
`;
};

/**
 * System prompt for the standard AI response (no personalization)
 * @param {string} lang - Selected language code
 * @returns {string} The formatted system prompt
 */
export const getStandardPrompt = (lang) => {
    return `Tu es un assistant IA générique. Réponds à la question de manière directe et classique, sans aucune personnalisation. Langue : ${lang}.`;
};
