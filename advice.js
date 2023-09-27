const request = require("request");
const srod = require("srod-v2");

module.exports = {
 config: {
 name: "advice",
 aliases: ["av"],
 version: "1.0",
 author: "John Arida",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "randomly give 1 advice",
 },
 longDescription: {
 en: "randomly give you 1 piece of advice",
 },
 category: "box chat",
 guide:{
 en: "{p}advice"
 }
 },
 onStart: async function ({ event, api, args }) {
 try {
 const data = (await srod.GetAdvice()).embed.description;
 const translatedData = await translateText(data);
 api.sendMessage(translatedData, event.threadID, event.messageID);
 } catch (error) {
 console.error(error);
 api.sendMessage("An error has occurred!", event.threadID, event.messageID);
 }
 },
};

async function translateText(text) {
 return new Promise((resolve, reject) => {
 const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tl&dt=t&q=${text}`;
 request(url, (error, response, body) => {
 if (error) {
 reject(error);
 } else if (response.statusCode >= 400) {
 reject(`HTTP Error: ${response.statusCode} - ${response.statusMessage}`);
 } else {
 const retrievedData = JSON.parse(body);
 let translatedText = '';
 retrievedData[0].forEach(item => (item[0]) ? translatedText += item[0] : '');
 resolve(`${text}\n\n${translatedText}`);
 }
 });
 });
   }