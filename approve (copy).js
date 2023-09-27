const fs = require('fs');

module.exports = {
  config: {
    name: "approve",
    version: "1.0",
    author: "Luffy",
    shortDescription: {
      en: "approve bot gc",
      vi: "Add or remove a thread ID from threads.json"
    },
    longDescription: {
      en: "",
      vi: "Add or remove a thread ID from threads.json. Usage: /approve [add/delete] [thread ID]"
    },
    category: "Developer",
    guide: {
      en: "{pn} [add|del|list]",
      vi: "To use this command, type /approve [add/delete] [thread ID]"
    }
  },
  onStart: async function ({ message, args, threadsData }) {
    
    const threadsFile = 'threads.json';

    if (args.length < 1) {
      message.reply("You must provide an action: approve (add/delete) [thread ID]");
      return;
    }

    const action = args[0];
    const threadId = args[1];

    let threads = [];
    try {
      threads = JSON.parse(fs.readFileSync(threadsFile));
    } catch (err) {
      console.error('', err);
    }

    if (action === "add") {
      if (!threads.includes(threadId)) {
        threads.push(threadId);
        fs.writeFileSync(threadsFile, JSON.stringify(threads));
        message.reply(`Thread ${threadId} approved ✅`);
      } else {
        message.reply(`Thread ${threadId} is already approved ✅`);
      }
    } else if (action === "del") {
      const index = threads.indexOf(threadId);
      if (index >= 0) {
        threads.splice(index, 1);
        fs.writeFileSync(threadsFile, JSON.stringify(threads));
        message.reply(`Thread ${threadId} disapproved ✅`);
      } else {
        message.reply(`Thread ${threadId} was not approved before ❌`);
      }
    } else if (action === "list") {
      let threadList = "";
      for (let i = 0; i < threads.length; i++) {
        const threadData = await threadsData.get(threads[i]);
        const name = threadData.threadName;
        threadList += `${i + 1}. ${name} (${threads[i]})\n`;
      }
      if (threadList === "") {
        message.reply("No threads approved ❌");
      } else {
        message.reply(`Approved threads: ${threadList}`);
      }
    }
  }
};