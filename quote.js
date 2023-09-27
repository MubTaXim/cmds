const axios = require('axios');

module.exports = {
	config: {
		name: "quote",
		aliases: ["quote"],
		version: "1.0",
		author: "git@Tas33n",
		countDown: 5,
		role: 0,
		shortDescription: "get inspiration from legends",
		longDescription: "",
		category: "info",
		guide: "{pn}"
	},

	onStart: async function ({ message, args }) {
		const BASE_URL = `https://api.popcat.xyz/quote`;
		try {
			let res = await axios.get(BASE_URL)
			let res2 = res.data
			let quote = res2.quote
			let name = res2.name
			let anime = res2.anime
			const form = {
				body: `${quote}\n\n` + `~ ${name}\n from: ${anime}\n`
			};
			// if (img) {
			// 	form.attachment = []
			// 	form.attachment[0] = await global.utils.getStreamFromURL(img);

			// }
			message.reply(form);
		} catch (e) { message.reply('🥺 Not Found') }

	}
};
