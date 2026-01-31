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
 * @param {string} lang - Selected language code
 * @returns {string} The formatted generation prompt
 */
export const getFollowUpGenPrompt = (profile, lang) => {
    return `Tu es Virgile. Continues la discussion avec le même style, le même profil (${profile}) et les mêmes filtres initiaux.
Réponds directement à la nouvelle question.
Langue : ${lang}`;
};
