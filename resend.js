const request = require('request');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: 'resend',
    version: '1.0',
    author: 'Samir B. Thakuri',
    countDown: 5,
    role: 0,
    shortDescription: '',
    longDescription: '',
    category: 'test',
  },

  onChat: async function ({ event, api, threadsData, usersData }) {
    const { writeFileSync, createReadStream } = require('fs');
    let { messageID, senderID, threadID, body: content } = event;
    if (!global.logMessage) global.logMessage = new Map();
    if (!global.data) global.data = {};
    if (!global.data.botID) global.data.botID = api.getCurrentUserID();

    const thread = await threadsData.get(parseInt(threadID)) || {};

    if (typeof thread['resend'] !== 'undefined' && thread['resend'] === false) return;

    if (senderID === global.data.botID) return;

    if (event.type !== 'message_unsend') {
      global.logMessage.set(messageID, {
        msgBody: content,
        attachment: event.attachments,
      });
    }
    if (event.type === 'message_unsend') {
      var getMsg = global.logMessage.get(messageID);
      if (!getMsg) return;
      const data = await usersData.get(senderID);
      const name = await usersData.getName(senderID);
      if (getMsg.attachment[0] === undefined) {
        api.sendMessage(`${name} removed this message: ${getMsg.msgBody}`, threadID);
      } else {
        let num = 0;
        let msg = {
          body: `${name} just removed ${getMsg.attachment.length} attachment(s).${getMsg.msgBody !== '' ? `\nContent: ${getMsg.msgBody}` : ''}`,
          attachment: [],
          mentions: { tag: name, id: senderID },
        };
        for (var i of getMsg.attachment) {
          num += 1;
          var getURL = await request.get(i.url);
          var pathname = getURL.uri.pathname;
          var ext = pathname.substring(pathname.lastIndexOf('.') + 1);
          var path = `./cache/${num}.${ext}`;
          var dataStream = (await axios.get(i.url, { responseType: 'stream' })).data;
          dataStream.pipe(fs.createWriteStream(path));
          msg.attachment.push(createReadStream(path));
        }
        api.sendMessage(msg, threadID);
      }
    }
  },

  onStart: async function ({ api, event, threadsData, args }) {
    const { threadID, messageID } = event;

    if (args.length > 0 && (args[0] === 'on' || args[0] === 'off')) {
      const resendEnabled = args[0] === 'on';
      await threadsData.set(threadID, resendEnabled, 'resend');
      return api.sendMessage(`Successfully turned ${resendEnabled ? 'on' : 'off'} resend!`, threadID, messageID);
    }

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync('./resend_data.json', 'utf-8'));
    } catch (error) {
      console.log(error);
    }
    const resendEnabled = data[threadID] ? data[threadID] : false;
    data[threadID] = !resendEnabled;

    fs.writeFileSync('./resend_data.json', JSON.stringify(data, null, 2));

    return api.sendMessage(`Successfully ${(data[threadID] === true) ? 'turned on' : 'turned off'} resend!`, threadID, messageID);
  },
};