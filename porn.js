const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "xvid",
    aliases: ["porn","xnxx"],
    version: "69",
    role: 0,
    author: "JARiF x Mero",
    description: "Xvideos",
    category: "nsfw",
    guide: {en:"{pn} [name+name]"},
    cooldowns: 0
  },

  	onStart: async function({ event, message, getLang, threadsData, api, args }) {
    const query = args.join(" ");
		if (!query) {
        return api.sendMessage(
          `Please include tag/s of the video. \\Ex. solo+milf (add more tags if needed).`,
          event.messageID
        );
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(`https://api-lux.luxannareyes.repl.co/xfetch?q=${encodeURIComponent(query)}`);
      const data = response.data;

      if (!data || !data.video) {
        return api.sendMessage(
          `No video found for "${query}"`,
          event.messageID
        );
      }

      const videoUrl = data.video;
      const videoName = `${query}_video.mp4`;
      const videoFilePath = `./${videoName}`;

      const writer = fs.createWriteStream(videoFilePath);
      const responseStream = await axios.get(videoUrl, { responseType: 'stream' });

      responseStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(
        {
          attachment: fs.createReadStream(videoFilePath),
          body: `✅ Done\━━━━━━━━━━━━━━━\Video result for "${query}"\━━━━━━━━━━━━━━━`,
        },
        (error, info) => {
          fs.unlinkSync(videoFilePath);
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      api.sendMessage(
        "An error occurred while fetching videos.",
        event.threadID,
        event.messageID
      );
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};