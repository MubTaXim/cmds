const axios = require('axios');

module.exports = {
  config: {
    name: "prompt3",
    version: "1.0",
    author: "JARiF",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get midjourney prompts better than vortex."
    },
    category: "AI"
  },
  onStart: async function ({ message, event, args, api }) { 
    const khankir_chele = args.join(" ");

    try {
      const response = await axios.get(`https://jarif-noob.gadhaame.repl.co/prompt?khankir_chele=${encodeURIComponent(khankir_chele)}`);
      const prompt = response.data.response;

      await api.sendMessage(prompt, event.threadID, event.messageID);
    } catch (error) {
      console.error('An error occurred');
    }
  }
};