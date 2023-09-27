const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "riruru",
		version: "1.1",
		author: "Mubtasim",
		countDown: 5,
		role: 0,
		shortDescription: "",
		longDescription: "",
		category: "system",
		guide: {
			en: ""
		}
	},

	langs: {
		en: {
			myPrefix: "‎ \n          Hey Dear 😺 \n\n🌐 System prefix: %1\n🛸 Your box chat prefix: %2\n\n           🌸 Riruru 🌸"
		}
	},
onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
  if (!args[0])
			return message.SyntaxError();
  },
  
  onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "riruru")
			return () => {
        //console.log(global.GoatBot.onReaction)
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
			};
	}
};