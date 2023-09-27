module.exports = {
  config: {
    name: "fungc",
    aliases: ["fungc"],
    version: "1.0",
    author: "Jesan | fixed by mero",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Adds user to fungc."
    },
    longDescription: {
      en: "This command adds the user to the bot fungc."
    },
    category: "fun",
    guide: {
      en: "{pn} :to add yourself to the admin fungc"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    const supportGroupId = "23907465645511286"; // ID of the support group

    const threadID = event.threadID;
    const userID = event.senderID;

    // Check if the user is already in the support group
    try {
      const threadInfo = await api.getThreadInfo(supportGroupId);
      const participantIDs = threadInfo.participantIDs;
      if (participantIDs.includes(userID)) {
        // User is already in the support group
        api.sendMessage(
          "✅ You are already in fungc. If you didn't find it, please check your message requests or spam box•",
          threadID
        );
      } else {
        // Add user to the support group
        api.addUserToGroup(userID, supportGroupId, (err) => {
          if (err) {
            console.error("❎ | Failed to add user to fungc:", err);
            api.sendMessage(
              "❎ Sorry, I can't add you to fungc. It may be because your account is set to private or you have disabled message requests. Please change your settings or add me to your inbox and try again...Or you can use 'called' cmd to contract us•",
              threadID
            );
          } else {
            api.sendMessage(
              "✅ You have been added to the fungc. If you didn't find the box in your inbox, please check your message requests or spam box•",
              threadID
            );
          }
        });
      }
    } catch (e) {
      console.error("Failed to get thread info:", e);
      api.sendMessage(
        "❎ Failed to retrieve the fungc information. or maybe You are already in fungc. If you can't find it, please check your message requests or spam box•",
        threadID
      );
    }
  }
};