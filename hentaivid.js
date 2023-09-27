const axios = require('axios');
module.exports = {
	config: {
		name: "hentaivid",
		aliases: ["henvid", "hentaivideo"],
		version: "1.0",
		author: "Drewhan",
		countDown: 5,
		role: 1,
		shortDescription: "hentai videos",
		longDescription: "get hentai videos",
		category: "adult",
		guide: {
			en: "{p} hentaivid "
 }
 },

	onStart: async function ({ event, message, getLang, threadsData, api, args }) {
    const permission = ["100035530456587"];
  if (!permission.includes(event.senderID)) {
    api.sendMessage("Only Drewhan has permission.", event.threadID, event.messageID);
    return;
  }
			const BASE_URL = `https://milanbhandari.imageapi.repl.co/hentai?apikey=xyzmilan`;
 await message.reply("Processing your video please wait..."); 
			try {
				let res = await axios.get(BASE_URL)
				let vid = res.data.url;
				const form = {
					body: ``
				};
		 if (vid)
					form.attachment = await global.utils.getStreamFromURL(vid);
				message.reply(form); 
			} catch (e) { message.reply(`Something went wrong. Please try again later`)
 console.log(e);
 }

		}
	};