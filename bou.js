
const axios = require('axios');

module.exports = {
  config: {
    name: "bou",
    version: "1.0.0",
    author: "ntf",
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: "chat qua simsimi",
      en: "chat via simsimi"
    },
    longDescription: {
      vi: "Cho phép bạn trò chuyện qua SimSimi.",
      en: "Allows you to chat via SimSimi."
    },
    category: "chatbot",
    guide: {
      en: "just talk"
    }
  },

  langs: {
    vi: {
      hello: "xin chào",
      helloWithName: "xin chào, id facebook của bạn là %1"
    }, // Vietnamese language
    en: {
      hello: "hello world",
      helloWithName: "hello, your facebook id is %1"
    } // English language
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, event }) {
    const { threadID, messageID, senderID, body } = event;
    const sendMessage = (message) => api.sendMessage(message, threadID, messageID);

    if (args.length === 0) {
      sendMessage(`kire mukh diye kotha berhoyna naki?`);
    } else {
      const { data, error } = await simsimi(args.join(" "));
      if (error) {
        // Handle the error here
      } else if (!data.success) {
        sendMessage(data.error);
      } else {
        sendMessage(data.success);
      }
    }
  }
};

async function simsimi(text) {
  const encodedText = encodeURIComponent(text);

  try {
    const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodedText}&lc=en&cf=false&name=Eri&key=CIQHPE1cSfZFev-EhpwRbndXxcD9YGdTlbGReM`);
    return { error: !1, data: response.data };
  } catch (error) {
    return { error: !0, data: {} };
  }
}
