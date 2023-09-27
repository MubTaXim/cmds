const axios = require('axios');
const request = require('request');
const fs = require('fs-extra');

module.exports = {
 config: {
 name: 'cosplay',
 aliases: ['cosplayer'],
 version: '1.0',
 author: 'XyryllPanget',
 countDown: 5,
 role: 0,
 shortDescription: {
 en: 'Random cosplay photo'
 },
 longDescription: {
 en: 'Random cosplay photo'
 },
 category: 'Anime',
 guide: {
 en: '{p}cosplay'
 }
 },

 onStart: async function ({ api, event }) {
 const response = await axios.get('https://leiamnash.repl.co/cosplay');
 const imageUrl = response.data.image;

 const imageStream = request(imageUrl);
 const filePath = `${__dirname}/tmp/cosplay_${event.senderID}.jpg`;
 const writeStream = fs.createWriteStream(filePath);

 imageStream.pipe(writeStream);
 writeStream.on('close', () => {
 api.sendMessage({
 body: '',
 attachment: fs.createReadStream(filePath)
 }, event.threadID, event.messageID);
 });
 }
};