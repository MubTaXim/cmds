const fs = require("fs");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "art3",
    aliases: ["p2a3"],
    version: "1.1",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "ai imagination",
    guide: { 
      en: "Reply to an image."
    },
  },

  onStart: async function ({ event, message, getLang, threadsData, api, args }) {
    try {
      if (args.length >= 2 || (event.type === "message_reply" && event.messageReply.attachments.length > 0 && event.messageReply.attachments[0].type === "photo")) {
        message.reply("âœ… | Transforming your image...");

        const imageUrl = event.type === "message_reply" ? event.messageReply.attachments[0].url : args[0];
        const prompt = event.type === "message_reply" ? "same pose, same person, same environment, all same just add anime effect,anime look,boy will be a boy,girl will be a girl" : args.slice(1).join(" ");

        const formData = new FormData();
        formData.append("key", "2a49c67a843e01c70c426c2f31dffb2e");
        formData.append("image", imageUrl);

        const imgbbResponse = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders(),
        });
        const imgbbImageUrl = imgbbResponse.data.data.url;

        const response = await axios.get(`https://jarif-art.blackxlegend1.repl.co/transform?imgurl=${imgbbImageUrl}&prompt=${prompt}`, {
          responseType: "arraybuffer",
        });

        const imageBuffer = Buffer.from(response.data);
        const pathSave = path.join(__dirname, "art.png");

        await saveArrayBufferToFile(imageBuffer, pathSave);

        message.reply(
          {
            
            attachment: fs.createReadStream(pathSave),
            body: `âœ… | Image Transformed.`
          },
          () => {
            fs.unlinkSync(pathSave);
          }
        );
      } else if (event.type === "message_reply") {
        message.reply("Reply with an image.");
      } else {
        message.reply("Please provide an image link and a prompt, or reply with an image.");
      }
    } catch (e) {
      console.error(e);
      message.reply("âŒ | Something went wrong.");
    }
  },
};

async function saveArrayBufferToFile(arrayBuffer, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, Buffer.from(arrayBuffer), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}