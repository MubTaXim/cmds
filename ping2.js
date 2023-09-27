module.exports = {
 config: {
 name: "ping2",
 verion: 1.0,
 author: "Otin&mero",
 role: 0,
 shortDescription: {
 en: "Displays the current ping and determines if it is smooth or not."
 },
 longDescription: {
 en: "Displays the current ping and determines if it is smooth or not."
 },
 category: "utility",
 guide: {
 en: "Use {p}ping to check the current ping and determine if it is smooth or not."
 }
 },
 onStart: async function({ api, event, args }) {
 const timeStart = Date.now();
 
 await api.sendMessage({
 body: "Checking ping..."
 }, event.threadID);
 
 const ping = Date.now() - timeStart;
 
 let pingStatus = "Not smooth throw ur router bitch";
 if (ping < 300) {
   pingStatus = "Smooth like mahir's tiny pussy";
 }
 
 api.sendMessage({
 body: `The bot's current ping is ${ping}ms.\nPing status: ${pingStatus}`
 }, event.threadID);
 }
};