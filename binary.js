const axios = require('axios');

module.exports = {
 config: {
 name: "binary",
 aliases: ["bin"],
 version: "1.0",
 author: "XyryllPanget",
 countDown: 0,
 role: 0,
 shortDescription: {
 en: "Converts text to binary."
 },
 longDescription: {
 en: "Converts text to binary using an API."
 },
 category: "utility",
 guide: {
 en: "To use the command, type !binary [text]. The bot will then convert the text to binary."
 }
 },
 onStart: async function ({ api, event, args }) {
 // Make sure the user provided some text to convert
 if (!args[0]) {
 api.sendMessage("Please provide some text to convert to binary.", event.threadID);
 return;
 }

 // Call the API to convert the text to binary
 const response = await axios.get(`https://api.funtranslations.com/translate/binary.json?text=${encodeURIComponent(args[0])}`);

 // Check if the API call was successful
 if (response.status !== 200 || !response.data.success) {
 api.sendMessage("Sorry, an error occurred while converting the text to binary.", event.threadID);
 return;
 }

 // Send the binary result back to the user
 api.sendMessage(response.data.contents.translated, event.threadID);
 }
};