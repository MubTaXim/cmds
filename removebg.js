const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data'); // Added for remove.bg integration

function getLang(lang) {
  // You can implement language detection logic here
  // For now, let's assume the language is 'en' (English)
  return 'en';
}

module.exports = {
  config: {
    name: 'removebg',
    version: '1.0.0',
    author: 'ntf',
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: 'Loại bỏ nền hình ảnh',
      en: 'Remove background from images',
    },
    longDescription: {
      vi: 'Loại bỏ nền hình ảnh từ một ảnh đã cho.',
      en: 'Remove background from an image provided as a reply.',
    },
    category: 'edit-img',
    guide: {
      vi: 'Hãy trả lời một tin nhắn chứa ảnh bằng cách sử dụng `.removebg`.',
      en: 'Please reply to a message containing an image with `removebg`',
    },
  },

  langs: {
    vi: {
      removingBackground: '⏱ Đang loại bỏ nền. Vui lòng đợi ...',
      error: 'Đã xảy ra lỗi khi xử lý ảnh.',
    },
    en: {
      removingBackground: '⏱ Removing Background. Please wait ...',
      error: 'An error occurred while processing the image.',
    },
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, event }) {
    const { threadID, messageID } = event;

    // Check if the message is a reply
    if (!event.messageReply || event.messageReply.attachments.length === 0) {
      return api.sendMessage(this.langs[getLang()]['guide'], threadID, messageID);
    }

    // Get the URL of the replied image
    const imgurl = event.messageReply.attachments[0].url;
    api.sendMessage(this.langs[getLang()]['removingBackground'], threadID, messageID);

    try {
      // Construct the image URL for remove.bg
      const removeBgUrl = 'https://api.remove.bg/v1.0/removebg';

      // Create a FormData object and append the image_url parameter
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_url', imgurl);

      // Send a POST request to remove.bg API
      const response = await axios({
        method: 'post',
        url: removeBgUrl,
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': 'QJm2xgebVs8PUgBKwW4AixZH',
        },
        encoding: null,
      });

      // Save the edited image temporarily
      const tempFilePath = path.join(__dirname, 'temp', `${uuidv4()}.png`);
      fs.writeFileSync(tempFilePath, response.data);

      // Send the edited image as an attachment reply
      api.sendMessage(
        {
          attachment: fs.createReadStream(tempFilePath),
        },
        threadID,
        null,
        messageID
      );

      // Remove the temporary file
      // Delay the deletion of the temporary file by 5 seconds
      setTimeout(() => {
        try {
          // Remove the temporary file after 5 seconds
          fs.unlinkSync(tempFilePath);
          console.log('Temporary file deleted:', tempFilePath);
        } catch (deleteError) {
          console.error('Error deleting the temporary file:', deleteError);
        }
      }, 5000); // 5000 milliseconds (5 seconds) delay
    } catch (error) {
      console.error('Error fetching or processing the image:', error);
      api.sendMessage(this.langs[getLang()]['error'], threadID, messageID);
    }
  },
};
