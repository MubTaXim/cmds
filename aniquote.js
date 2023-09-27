module.exports = {
 config: {
 name: "aniquote",
 aliases: ["animequote"],
 version: "1.0",
 author: "XyryllPanget",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Random anime quote"
 },
 longDescription: {
 en: "Random anime quote"
 },
 category: "Anime",
 guide: {
 en: "{pn}"
 }
 },
 onStart: async function ({ api, event, args }) {
 const axios = require("axios");
 axios.get(`https://leiamnash.repl.co/aniquote`).then((response) => {
 const quote = response.data.quote;
 api.sendMessage(quote, event.threadID, event.messageID);
 });
 }
};