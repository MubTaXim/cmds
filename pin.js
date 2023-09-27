const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
	config: {
		name: "pinterest", 
		aliases: ["pin"], 
		version: "1.0.2", 
		author: "JVB", 
		role: 0,
		countDown: 60,
		shortDescription:{
			en: "Search for images on Pinterest"}, 
		longDescription:{
			en:""}, 
		category: "Search", 
		guide: {
			en: "{pn} <search query> <number of img>"
				+ "\nexample: {pn} naruto-9"
		}
	}, 

	onStart: async function({ api, event, args }) {
		try {
			const keySearch = args.join(" ");
			if (!keySearch.includes("-")) {
				return api.sendMessage(`Please enter the search query and number of images to return in the format: ${config.guide.en}`, event.threadID, event.messageID);
			}
			const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
      let numberSearch = keySearch.split("-").pop() || 6
    if(numberSearch>12){
      numberSearch = 12
    }

			const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
			const data = res.data.data;
			const imgData = [];

			for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
				const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
				const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
				await fs.outputFile(imgPath, imgResponse.data);
				imgData.push(fs.createReadStream(imgPath));
			}

			await api.sendMessage({
				attachment: imgData,
				body: ``
			}, event.threadID, event.messageID);

			await fs.remove(path.join(__dirname, 'cache'));
		} catch (error) {
			console.error(error);
			return api.sendMessage(`Please enter the search query and -number of images(1-12)`, event.threadID, event.messageID);
		}
	}
};