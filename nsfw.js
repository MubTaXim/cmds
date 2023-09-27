const axios = require('axios');
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "nsfw",
		aliases: ["nsfw"],
		version: "1.0",
		author: "MILAN x mero",
		countDown: 5,
		role: 0,
		shortDescription: "get nsfw images",
		longDescription: "",
		category: "nsfw",
		guide: {
			vi: "{pn}",
			en: "{pn}"
		}
	},

  langs: {
  		en: {
  			error: "An error occurred, please try again later",
  			approve_success: "This command has been approved!",
  			approve_error: "Only administrators can approve this command",
  			disapprove_success: "This command has been disapproved!",
  			disapprove_error: "Only administrators can disapprove the imagine command",
  			already_approved: "This command has already been approved",
  			already_disapproved: "This command has already been disapproved",
  			group_not_approved: "'nsfw' is a premium cmd. You need approval from admin to use this cmd."
  		}
  	},
  
  	onStart: async function({ event, message, getLang, threadsData, api, args }) {
  			const { threadID } = event;
  
  			if (args[0] === "approve") {
  				if (global.GoatBot.config.adminBot.includes(event.senderID)) {
  					const approved = await threadsData.get(threadID, "settings.imagine_approved");
  					if (approved) {
  						return message.reply(getLang("already_approved"));
  					}
  					await threadsData.set(threadID, true, "settings.imagine_approved");
  					return message.reply(getLang("approve_success"));
  				}
  				return message.reply(getLang("approve_error"));
  			} else if (args[0] === "disapprove") {
  				if (global.GoatBot.config.adminBot.includes(event.senderID)) {
  					const approved = await threadsData.get(threadID, "settings.imagine_approved");
  					if (!approved) {
  						return message.reply(getLang("already_disapproved"));
  					}
  					await threadsData.set(threadID, false, "settings.imagine_approved");
  					return message.reply(getLang("disapprove_success"));
  				}
  				return message.reply(getLang("disapprove_error"));
  			}
  
  			const approved = await threadsData.get(threadID, "settings.imagine_approved");
  			if (!approved) {
  				return message.reply(getLang("group_not_approved"));
  			}
	try {
 const { data } = await axios.get("https://milanbhandari.imageapi.repl.co/nsfw?apikey=xyzmilan");
 const url = await axios.get(data.url, { responseType: "arraybuffer" });
 fs.writeFileSync(__dirname + "/tmp/nsfw.png", Buffer.from(url.data, "utf-8"));
 const msg = "";
 const Img = [
 fs.createReadStream(__dirname + "/tmp/nsfw.png")
 ];
 return api.sendMessage({
 body: msg,
 attachment: Img
 }, event.threadID, event.messageID);
 } catch (error) {
 console.error(error);
 }
 }
};