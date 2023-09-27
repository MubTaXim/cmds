const axios = require("axios");

module.exports = {
  config: {
    name: "gpt4",
    version: "1.0",
    author: "Rishad",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: "chat with gpt"
    },
    category: "chat",
    guide: {
      en: "{pn} 'prompt'\nexample:\n{pn} hi there"
    }
  },
  onStart: async function ({ message, event, args, commandName }) {
    const prompt = args.join(" ");
    if (!prompt) {
      message.reply(`Please provide some text, and gpt will respond to your input. \n\nExample: /gpt2 hi there`);
      return;
    }

    try {
      const response = await axios.get(
        `https://rishadapi.rishad100.repl.co/api/gpt?input=${encodeURIComponent(prompt)}`
      );

      if (response.data && response.data.ChatGPT) {
        message.reply(
          {
            body: response.data.ChatGPT
          },
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID
            });
          }
        );
      } else {
        console.error("API Error:", response.data);
        sendErrorMessage(message, "Server not responding ❌");
      }
    } catch (error) {
      console.error("Request Error:", error.message);
      sendErrorMessage(message, "Server not responding ❌");
    }
  },
  onReply: async function ({ message, event, Reply, args }) {
    let { author, commandName } = Reply;
    if (event.senderID !== author) return;
    const prompt = args.join(" ");

    try {
      const response = await axios.get(
        `https://rishadapi.rishad100.repl.co/api/gpt?input=${encodeURIComponent(prompt)}`
      );

      if (response.data && response.data.ChatGPT) {
        message.reply(
          {
            body: response.data.ChatGPT
          },
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID
            });
          }
        );
      } else {
        console.error("API Error:", response.data);
        sendErrorMessage(message, "Server not responding ❌");
      }
    } catch (error) {
      console.error("Request Error:", error.message);
      sendErrorMessage(message, "Server not responding ❌");
    }
  }
};

function sendErrorMessage(message, errorMessage) {
  message.reply({ body: errorMessage });
                         } 