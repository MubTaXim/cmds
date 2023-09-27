const fs = require("fs");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "art2",
    aliases: ["img2img2"],
    version: "1.1",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "ai imagination",
    guide: { 
      en: "Reply to an image. To add prompts, use the format: {pn} <prompt>"
    },
  },

  onStart: async function ({ event, message, getLang, threadsData, api, args }) {
    if (args.length >= 2) {
      try {
        message.reply("Please wait....");
        
        const imageUrl = args[0];
        const prompt = args.slice(1).join(" "); 

        const formData = new FormData();
        formData.append("key", "2a49c67a843e01c70c426c2f31dffb2e");
        formData.append("image", imageUrl);

        const imgbbResponse = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders()
        });
        const imgbbImageUrl = imgbbResponse.data.data.url;

        const response = await axios.get(`https://jarif-art.blackxlegend1.repl.co/transform?imgurl=${imgbbImageUrl}&prompt=${prompt}`, {
          responseType: 'arraybuffer'
        });

        const imageBuffer = Buffer.from(response.data);
        const pathSave = path.join(__dirname, "tmp", "art.png");

        await saveArrayBufferToFile(imageBuffer, pathSave);

        message.reply(
          {
            attachment: fs.createReadStream(pathSave),
          },
          () => {
            fs.unlinkSync(pathSave);
          }
        );
      } catch (e) {
        console.log(e);
        message.reply("❌ | Add prompts...");
      }
    } else if (event.type === "message_reply") {
      if (
        event.messageReply.attachments.length > 0 &&
        event.messageReply.attachments[0].type === "photo"
      ) {
        try {
          message.reply("✅ | Please wait.......");
          
          const imageUrl = event.messageReply.attachments[0].url;
          const prompt = args.join(" "); 

          const formData = new FormData();
          formData.append("key", "2a49c67a843e01c70c426c2f31dffb2e");
          formData.append("image", imageUrl);

          const imgbbResponse = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: formData.getHeaders()
          });
          const imgbbImageUrl = imgbbResponse.data.data.url;

          const response = await axios.get(`https://jarif-art.blackxlegend1.repl.co/transform?imgurl=${imgbbImageUrl}&prompt=${prompt}`, {
            responseType: 'arraybuffer'
          });

          const imageBuffer = Buffer.from(response.data);
          const pathSave = path.join(__dirname, "tmp", "art.png");

          await saveArrayBufferToFile(imageBuffer, pathSave);

          message.reply(
            {
              attachment: fs.createReadStream(pathSave),
            },
            () => {
              fs.unlinkSync(pathSave);
            }
          );
        } catch (e) {
          console.log(e);
          message.reply("❌ | Add prompts...");
        }
      } else {
        message.reply("Reply with an image.");
      }
    } else {
      message.reply("Please provide an image link and a prompt, or reply with an image.");
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