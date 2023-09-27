const axios = require('axios');

module.exports = {
 config: {
 name: 'cat',
 aliases: ['cat','meow'],
 version: '1.0',
 author: 'razihel',
 role: 0,
 category: 'fun',
 shortDescription: {
 en: 'Sends a random cat image.'
 },
 longDescription: {
 en: 'Sends a random cat images.'
 },
 guide: {
 en: '{pn}'
 }
 },
 onStart: async function ({ api, event }) {
 const response = await axios.get('https://api.thecatapi.com/v1/images/search');

 const imageURL = response.data[0].url;

 const stream = await global.utils.getStreamFromURL(imageURL);

 api.sendMessage({
 body: '', 
 attachment: stream
 }, event.threadID, event.messageID);
 }
};