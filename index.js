const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY,
  }),
  serviceUrl: process.env.URL,
});

exports.handler = async (event, context, callback) => {
    const { historial_clinico } = event;

    try {
        const analyzeParams = {
            'text': historial_clinico,
            'features': {
              'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 5,
              },
              'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 5,
              },
            },
        };


        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
        const resultObj = analysisResults.result;
        const keywords = {};
        const entities = {};

        resultObj.keywords.forEach(e => {
            keywords[e.text] = {
                "sentimiento": e.sentiment.label,
                "relevancia": e.relevance,
                "repeticiones": e.count,
                "emocion": e.emotion,
                "confianza": e.confidence,
            }
        });

        resultObj.entities.forEach(e => {
            entities[e.text] = {
                tipo: e.type,
                sentimiento: e.sentiment.label,
                relevancia: e.relevance,
                emocion: e.emotion,
                repeticiones: e.count,
                confianza: e.confidence
            }
        });

        const res = {
            lenguaje_texto: resultObj.language,
            palabras_clave: resultObj.keywords.map(e => e.text),
            entidades: resultObj.entities.map(e => e.text),
            palabras_clave_desc: keywords,
            entidades_desc: entities,
        }

        return res;
    } catch (err) {
        throw new Error("Error al procesar. ", err);
    }
};