const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
module.exports = {
	config: {
		name: "catsay2",
		version: "1.0",
		author: "munem.",
		countDown: 10,
		role: 0,
		shortDescription: "Cat image",
		longDescription: "",
		category: "image",
		guide: {
			en: "{p}{n} "
		},
	},

  

	onStart: async function ({ message, args, event, api }) {

	  
    const info = args.join(" ");
		if (!info){
			return message.reply(`Please enter a text`);
		}else {
		const msg = info.split("|");
		const text = msg[0];
		
      
  await message.reply("");
   
      const img = (`https://cataas.com/cat/says/${text}`)			
                 const form = {
				body: ``
			};
				form.attachment = []
				form.attachment[0] = await global.utils.getStreamFromURL(img);
			message.reply(form);
			  }
}};