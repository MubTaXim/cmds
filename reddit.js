const axios = require("axios");

module.exports = {
  config: {
    name: "reddit",
    version: "1.0",
    author: "who?",
    countDown: 5,
    role: 0,
    shortDescription: "Get tons of info on a subreddit",
    longDescription: "Get tons of info on a subreddit",
    category: "utility",
    guide: {
      en: "{pn} text",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const juswa = args.join(" ");
      const response = await axios.get(`https://api.popcat.xyz/subreddit/${juswa}`);
      
      const data = response.data;
      const name = data.name;
      const title = data.title;
      const activeUsers = data.active_users;
      const members = data.members;
      const description = data.description;
      const url = data.url;
      
      const message = `Name: ${name}\nTitle: ${title}\nActive Users: ${activeUsers}\nMembers: ${members}\nDescription: ${description}\nURL: ${url}`;
      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error occurred:', error);
      return api.sendMessage("An error occurred while fetching subreddit information.", event.threadID, event.messageID);
    }
  }
};
