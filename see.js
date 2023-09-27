const axios = require('axios');
const fs = require('fs-extra');
const previousImages = new Set();
module.exports = {
  config: {
    name: "see",
    version: "1.0.0",
    author: "ntf",
    role: 0,
    shortDescription: {
      en: "Search and send images of a person using Google image search.",
    },
    longDescription: {
      en: "Search and send images of a person using Google image search.",
    },
    category: "edit-img",
    guide: {
      en: "Search and send images of a person using Google image search.",
    },
  },

  langs: {
    vi: {
      // ...
      longDescription: {
        vi: 'Chỉnh sửa hình ảnh dựa trên câu hỏi của bạn.',
        en: 'Edit images based on your question.',
      },
      // ...
    },
    en: {
      // ...
      longDescription: {
        vi: 'Chỉnh sửa hình ảnh dựa trên câu hỏi của bạn.',
        en: 'Edit images based on your question.',
      },
      // ...
    },
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, event }) {
    const { threadID, messageID } = event;
    const name = args.join(" ");

    if (!name) {
      return api.sendMessage("[Name] is required.", threadID, messageID);
    }

    try {
      // Replace with your Google API key and CSE ID
      const googleApiKey = 'AIzaSyAsBSaIX1gEwwNaTRzB2VpTgigEveq4N-o';
      const googleCseId = '138b2f6dab3ef4734';

      // Modify the URL to use the Google Custom Search API
      const response = await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params: {
            key: googleApiKey,
            cx: googleCseId,
            q: `${name}`,
            searchType: "image",
          },
        }
      );

      const data = response.data;

      if (data.items && data.items.length > 0) {
        const images = data.items;

        // Find the first image that hasn't been sent before
        let imageURL = null;
        for (const image of images) {
          if (!previousImages.has(image.link)) {
            imageURL = image.link;
            previousImages.add(image.link);
            break;
          }
        }

        if (imageURL) {
          // Fetch the image as a readable stream
          const imageResponse = await axios.get(imageURL, {
            responseType: "stream",
          });
          const imageStream = imageResponse.data;

          // Send the image as an attachment
          const message = {
            body: "",
            attachment: imageStream,
          };

          return api.sendMessage(message, threadID, messageID);
        } else {
          return api.sendMessage(
            `No new images found for "${name}"`,
            threadID,
            messageID
          );
        }
      } else {
        return api.sendMessage(`No images found for "${name}"`, threadID, messageID);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      return api.sendMessage("An error occurred while fetching images.", threadID, messageID);
    }
  },
};
