const axios = require('axios');

module.exports = {
  config: {
    name: "srch",
    author: "NIB",
    version: "1.1",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "search for cover characters"
    },
    longDescription: {
      en: ""
    },
    category: "image",
    guide: {
      en: "{p}{n} character name"
    }
  },

  langs: {

  },

  onStart: async function ({ args, message, getLang }) {
    if (!args.length) return message.reply("Enter a character name");
    const name = args.join(" ");
    const apiUrl = `https://www.nguyenmanh.name.vn/api/listAvt?key=${name}`;
    
    try {
      const response = await axios.get(apiUrl);
      const characters = response.data.split("\n");

      if (characters.length === 0 || (characters.length === 1 && characters[0] === "")) {
        return message.reply("No characters found");
      }

      const results = characters.map((character) => `~ ${character}`);
      const messageText = `Number of characters found: ${results.length}\n\nCharacters:\n${results.join("\n")}`;
      message.reply(messageText);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while searching for characters");
    }
  }
};
