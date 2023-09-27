const axios = require("axios");

module.exports = {
  config: {
    name: "teach",
    version: "1.0",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "box chat",
    guide: {
      en: "{p}teach your ask | my answer ",
    },
  },
  onStart: async function ({ api, event, args }) {
    const { messageID, threadID, senderID, body } = event;
    const tid = threadID,
      mid = messageID;
    const content = args.join(" ").split("|").map((item) => item.trim());
    const ask = content[0];
    const ans = content[1];
    if (!args[0])
      return api.sendMessage(
        "Use {p}teach your ask | simsimi-bn respond",
        tid,
        mid
      );
    try {
      const res = await axios.get(
        `https://simsimibn.syntax-team-co.repl.co/teach?ques=${ask}&ans=${ans}`
      );
      api.sendMessage(
        `Yeaaa! I'm Learned`,
        tid,
        mid
      );
    } catch (error) {
      console.log(error);
      api.sendMessage(
        "Sorry,something went wrong.",
        tid,
        mid
      );
    }
  },
};