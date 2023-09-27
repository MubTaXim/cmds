const axios = require('axios');

module.exports = {
  config: {
    name: "4k",
    version: "0.0.1",
    author: "ntfuck",
    category: "Image",
    description: "Increase image quality to 4k",
    usages: "[image]",
    cooldowns: 3,
    guide: {
      en: "{pn} :Increase image quality to 4k."
    }
  },

  langs: {
    vi: {
      hello: "xin chào thành viên mới",
      helloWithName: "xin chào thành vien mới, id facebook của bạn là %1"
    },
    en: {
      hello: "hello new member",
      helloWithName: "hello new member, your facebook id is %1"
    }
  },

  onStart: async function ({ api, event }) {
    let eta = 3; // Declare eta here

    const axiosInstance = axios.create();

    let send = msg => api.sendMessage(msg, event.threadID, event.messageID);

    if (event.type !== "message_reply") return send("Please reply to an image!");

    send(`Processing image resolution upgrade for ${event.messageReply.attachments.length} image(s) (${event.messageReply.attachments.length * eta}s)`);

    let stream = [];
    let exec_time = 0;

    for (let i of event.messageReply.attachments) {
      try {
        let res = await axiosInstance.get(encodeURI(`https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`), {
          responseType: "stream"
        });

        exec_time += +res.headers.exec_time;
        eta = res.headers.exec_time / 1000 << 0;
        res.data.path = "tmp.png";
        stream.push(res.data);
      } catch (error) {
        console.error(error);
        // Handle the error here, e.g., send an error message or log the error
      }
    }

    send({
      body: `Success (${exec_time / 1000 << 0}s)`,
      attachment: stream
    });
  }
};


/*
const axios = require('axios');

module.exports.config = {
  name: "4k",
  aliases: ["remini"],
  version: "0.0.1",
  author: "Cat",
  hasPermission: 0,
  credits: "Morgan FreeMan",
  description: "Increase image quality to 4k",
  commandCategory: "Image",
  usages: "[image]",
  cooldowns: 3,
  guide: {en: "{pn} :Increase image quality to 4k."}
};

let eta = 3;

module.exports.onStart = async ({ api, event }) => {
  const axiosInstance = axios.create();

  let send = msg => api.sendMessage(msg, event.threadID, event.messageID);

  if (event.type !== "message_reply") return send("Please reply to an image!");

  send(`Processing image resolution upgrade for ${event.messageReply.attachments.length} image(s) (${event.messageReply.attachments.length * eta}s)`);

  let stream = [];
  let exec_time = 0;

  for (let i of event.messageReply.attachments) {
    try {
      let res = await axiosInstance.get(encodeURI(`https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`), {
        responseType: "stream"
      });

      exec_time += +res.headers.exec_time;
      eta = res.headers.exec_time / 1000 << 0;
      res.data.path = "tmp.png";
      stream.push(res.data);
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., send an error message or log the error
    }
  }

  send({
    body: `Success (${exec_time / 1000 << 0}s)`,
    attachment: stream
  });
};
*/