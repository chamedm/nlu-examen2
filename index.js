require('dotenv').config();

const express = require('express')
const app = express();
const port = 8000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY,
  }),
  serviceUrl: process.env.URL,
});


app.post('/', (req, res) => {
  let textToAnalyze = req.body;
  console.log(textToAnalyze)
  const analyzeParams = {
    'text': textToAnalyze.text,
    'features': {
      'entities': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
      },
      'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
      },
    },
  };

  naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    return JSON.stringify(analysisResults, null, 2);
  }).then(analisysJSON => {
    res.send(analisysJSON)
  })
  .catch(err => {
    console.log('error:', err);
  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});