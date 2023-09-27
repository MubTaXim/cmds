const axios = require('axios');
const request = require("request");
const fs = require("fs-extra");

module.exports = {
 config: {
 name: "gfx3", 
 aliases: ["gfx3"], 
 version: "1.1",
 author: "mero", 
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "text to Anime Image letter"
 }, 
 longDescription: {
 en: "Make Text to image Animd Letters"
 }, 
 category: "utility", 
 guide: {
 en: "{pn} <text>"
 },
 }, 

 onStart: async function ({ api, event, args, message, Users }) {

let { senderID, threadID, messageID } = event;

 let pathImg = __dirname + `/tmp/${event.threadID}_${event.senderID}.png`;
 const text = args.join(" ");
 if (!text) return api.sendMessage(`Wrong Usage\nUse: gfx text`, event.threadID, event.messageID);
 let getWanted = (
 await axios.get(`https://tanjiro-api.onrender.com/gfx3?text=${text}&text2=Senpai&api_key=tanjiro`, {
 responseType: "arraybuffer",
 })
 ).data;
 fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
 return api.sendMessage(
 { attachment: fs.createReadStream(pathImg) },
 threadID,
 () => fs.unlinkSync(pathImg),
 messageID
 );
}, 
 } ;