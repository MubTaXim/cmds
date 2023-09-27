const axios = require('axios');

module.exports = {
config: {
name: "joke",
aliases: [],
author: "munem",
version: "1.0",
countDown: 5,
role: 0,
shortDescription: "Generates joke",
longDescription: "Generates joke",
category: "meme",
guide: {
vi: "{pn} <text>",
en: "{pn} <text>"
}
},
  
  onStart: async function ({ message }) {
	message.reply(" ");
	try {
		const { data } = await axios.get(`https://api.popcat.xyz/joke`);
		return message.reply(data.joke);
	}
	catch (err) {
		return message.reply("An error occurred, please try again later");
	}
}
 }   
