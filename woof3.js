const axios = require('axios');
const stringSimilarity = require('string-similarity');

module.exports = {
  config: {
    name: 'woof3',
    version: '1.1',
    author: 'Mubtasim',
    category: "simSimi-bn",
    cooldown: 0,
    role: 0,
    guide: {en: " {pn} <text>"},
    langs: {
      en: {
        noAnswerFound: "ki bolish vai. boba naki??", 
      }
    }
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const userQuestion = args.join(' ');
      if (!userQuestion) {
        message.reply(`You can't tell something?`);
        return;
      }

      const apiUrl = `https://simsimibn.syntax-team-co.repl.co/chat?ques=${encodeURIComponent(userQuestion)}`;
      const response = await axios.get(apiUrl);
      const botAnswer = response.data;

      if (!botAnswer) {
        message.reply('What? :)');
      } else {
        message.reply(botAnswer);
      }

    } catch (error) {
      console.error('Error occurred:', error.message);
      message.reply('An error occurred.');
    }
  } 
};