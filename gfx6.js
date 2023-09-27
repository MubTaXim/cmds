module.exports = {
	config: {
		name: "gfx6",
		aliases: ["gfx6"],
		version: "1.0",
		author: "mero",
		countDown: 5,
		role: 0,
		shortDescription: "",
		longDescription: "",
		category: "image",
		guide: { 
      en: "{pn} <text>"
 }
	},

	onStart: async function ({ api, event, args, Users }) {
		const request = require('request');
		const fs = require("fs-extra");
		const axios = require("axios");
		const pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
		const text = args.join(" ");
		if (!text) return api.sendMessage(`Wrong format\Use:/gfx text`, event.threadID, event.messageID);
		const getWanted = await axios.get(`https://tanjiro-api.onrender.com/gfx6?name=${text}&api_key=tanjiro`, { responseType: "arraybuffer" }).then(res => res.data).catch(() => null);
		if (!getWanted) return api.sendMessage(`An error occurred, please try again later!`, event.threadID, event.messageID);
		fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
		return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
	}
};