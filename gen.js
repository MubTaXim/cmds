const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  config: {
    name: "gen",
    version: "1.0.0",
    author: "ntf",
    category: "Ai",
    envConfig: {
      autoUnsend: true, // Set this to true to enable automatic unsending
      delayUnsend: 60 // Set the delay for unsending (in seconds)
    },
  },

  langs: {
    vi: {
      hello: "xin chào thành viên mới",
      helloWithName: "xin chào thành viên mới, id facebook của bạn là %1"
    }, // Vietnamese language
    en: {
      hello: "hello new member",
      helloWithName: "hello new member, your facebook id is %1"
    } // English language
  },

  onStart: async function ({ api, event, args, getLang }) {
    const { threadID, messageID } = event;

    // Extract the prompt from the message
    const prompt = args.join(" ");

    // Encode the prompt
    api.setMessageReaction("⏱", event.messageID, (err) => {}, true);
    const encodedPrompt = encodeURIComponent(prompt);
    api.sendMessage('✅ | Generating your imagination.Please wait...', threadID, messageID);

    // Define the URL for image generation
    const apiUrl = `https://api.prodia.com/v1/sd/generate`;

    try {
      // Make a POST request to initiate the image generation with the correct headers and payload
      const initiateResponse = await axios.post(apiUrl, {
        prompt: `${prompt} , ultra detailed, animated film, realistic lights, cinematic, studio photo, vivid colors, realistic lights, cinematic, sharp focus, photorealistic concept art, perfect composition, soft natural volumetric, cinematic perfect light, rendered in unreal engine, boost`,
        negative_prompt: "3d, cartoon, anime, sketches, (worst quality, bad quality, child, cropped:1.4), (watermark, signature, text, name:1.2), ((monochrome)), ((grayscale)), (bad-hands-5:1.0), (badhandv4:1.0), (easynegative:0.8), (bad-artist-anime:0.8), (bad-artist:0.8), (bad-picture-chill-75v:0.8), (bad_prompt_version2:0.8), (bad_quality:0.8)",
        model: "revAnimated_v122.safetensors [3f4fefd9]"
      }, {
        headers: {
          'X-Prodia-Key': '2dad6b58-314a-4cf8-9b84-48f223ccfa63',
          'accept': 'application/json',
          'content-type': 'application/json',
        },
      });

      // Extract the job ID from the response
      const jobId = initiateResponse.data.job;

      // Wait for the image generation to complete
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds (adjust as needed)

      // Construct the URL for the image download
      const imageUrl = `https://images.prodia.xyz/${jobId}.png`;

      // Download the image directly to a file
      const tempFileName = uuidv4() + '.png';
      const tempFilePath = path.join(__dirname, 'temp', tempFileName);

      const imageResponse = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream',
      });

      const imageStream = imageResponse.data.pipe(fs.createWriteStream(tempFilePath));

      await new Promise((resolve, reject) => {
        imageStream.on('finish', resolve);
        imageStream.on('error', reject);
      });

      // Send the image as an attachment and reply to the user
      const message = {
        body: '✅| Here is your generation\n ~Riruru AiBOT',
        attachment: fs.createReadStream(tempFilePath),
      };

      setTimeout(() => {
          fs.unlinkSync(tempFilePath);
        }, 5000);
      // Send the message
      const autoUnsend = module.exports.config.envConfig.autoUnsend;
      await api.sendMessage(message, threadID, async (error, info) => {
        if (!error) {
          if (autoUnsend) {
            const delay = 1000 * module.exports.config.envConfig.delayUnsend; // Convert delay to milliseconds
            try {
              await new Promise(resolve => setTimeout(resolve, delay));
              await api.unsendMessage(info.messageID);
            } catch (unsendError) {
              console.error("Error unsending message:", unsendError);
            }
          }
        } else {
          console.error("Error sending message:", error);
        }
      });
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage('An error occurred while generating the image. Please try again later.', threadID, messageID);
    }
  },
};
