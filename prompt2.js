const axios = require('axios');

module.exports = {
  config: {
    name: "prompt2",
    version: "1.0",
    author: "loufi",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "generate midJourney prompts"
    },
    longDescription: {
      vi: "",
      en: "generate midJourney prompts"
    },
    category: "AI"
  },

  onStart: async function({ message, args }) {
    axios.get('https://prompts.projectofloufi.repl.co/generateprompt', {
      params: {
        about: args.join(' '),
      },
    })
      .then((response) => {
        const prompt = response.data.prompt;
        message.reply(prompt);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
};