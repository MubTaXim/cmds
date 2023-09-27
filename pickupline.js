const axios = require('axios');

module.exports = {
  config: {
    name: "pickupline",
    aliases: ["pickupline"],
    version: "1.0",
    author: "Mubin due Cat",
    countDown: 5,
    role: 0,
    shortDescription: "get a random pickup line",
    longDescription: "get pick-up lines randomly",
    category: "fun",
    guide: "{pn} {{<name>}}"
  },

  onStart: async function ({ message, args }) {
   message.reply(" ");
    
      const BASE_URL = `https://api.popcat.xyz/pickuplines`;
      try {
         let res = await axios.get(BASE_URL);
        let title = res.data.title;
        let img = res.data.image;

        const form = {
          body: `${title}`
        };
        if (img)
          form.attachment = await global.utils.getStreamFromURL(img);
        message.reply(form);
      } catch (e) {
        message.reply(`Not Found`);
      }
  }
};
