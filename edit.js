
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const Jimp = require('jimp');
const { createCanvas, loadImage } = require('canvas');

// Replace with your Google API key and CSE ID
const googleApiKey = 'AIzaSyBCsuQ6EFUCR22TqRYAQWewMCCUyMxONQc';
const googleCseId = '138b2f6dab3ef4734';

// Create a Set to keep track of used image URLs from Google Search
const usedGoogleImageUrls = new Set();

module.exports = {
  config: {
    name: 'edit',
    version: '1.0.0',
    author: 'ntf',
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: 'Chỉnh sửa hình ảnh',
      en: 'Edit images with a specified prompt',
    },
    longDescription: {
      vi: 'Chỉnh sửa hình ảnh dựa trên câu hỏi của bạn.',
      en: 'Edit images based on your question.',
    },
    category: 'edit-img',
    guide: {
      vi: 'Hãy reply vào một hình ảnh bằng `edit with [prompt]`',
      en: 'Please reply to an image with `edit with [prompt]`',
    },
  },

  langs: {
      vi: {
        hello: 'xin chào',
        helloWithName: 'xin chào, id facebook của bạn là %1',
        shortDescription: 'Edit images with a specified prompt',
        guide: "Please reply to an image with `edit with [prompt]` or "
      },
      en: {
        hello: 'hello world',
        helloWithName: 'hello, your facebook id is %1',
        shortDescription: 'Edit images with a specified prompt',
         guide: "Please reply to an image with `edit with [prompt]` or `edit text [subtitle]`"
      },
  },

  onStart: async function ({
    api,
    event,
    message,
    args,
    getLang,
    threadsData,
    usersData,
    dashBoardData,
    globalData,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    role,
    commandName,
  }) {
    const { threadID, messageID } = event;
  
    // Check if the message is a reply with an attachment
    if (!event.messageReply || event.messageReply.attachments.length === 0) {
      return api.sendMessage(
        getLang('guide', { prompt: commandName }),
        threadID,
        messageID
      );
    }

    

    
    // Get the URL of the replied image
    const imgurl = event.messageReply.attachments[0].url;
    const prompt = event.body.slice(commandName.length + 1).trim(); // Extract the user-provided prompt
  
    
  
    let isWithPrompt = false; // Flag to track if the prompt contains 'with'
    let isTextPrompt = false; // Flag to track if the prompt contains 'text'
  
    // Check if the prompt contains 'with'
    if (prompt.toLowerCase().includes('with')) {
      isWithPrompt = true;
    }
  
    // Check if the prompt contains 'text'
    if (prompt.toLowerCase().includes('text')) {
      isTextPrompt = true;
    }

    if (!isWithPrompt && !isTextPrompt) {
      // Prompt doesn't contain "with" or "text," display the guide message
      return api.sendMessage(
        getLang('guide', { prompt: commandName }),
        threadID,
        messageID
      );
    }



    
    try {
      // Rest of your code remains unchanged
  
      // Now you can use the flags isWithPrompt and isTextPrompt to execute specific functionalities
      if (isWithPrompt) {
        api.sendMessage('⏱ Editing as you want. Please wait ...', threadID, messageID);

        const gprompt = prompt.replace(/with/i, '').trim();
         // Construct the image URL for remove.bg
        const removeBgUrl = 'https://api.remove.bg/v1.0/removebg';
  
        // Create a FormData object and append the image_url parameter
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_url', imgurl);
  
        // Send a POST request to remove.bg API to remove the background
        const response = await axios({
          method: 'post',
          url: removeBgUrl,
          data: formData,
          responseType: 'arraybuffer',
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': 'QJm2xgebVs8PUgBKwW4AixZH', // Your remove.bg API key
          },
          encoding: null,
        });
  
        // Load the background-removed image using Jimp
        const bgRemovedImage = await Jimp.read(Buffer.from(response.data));
  
        // Extract the dimensions (height and width) of the input image
        const imageDimensions = await Jimp.read(Buffer.from(response.data)).then(
          (image) => ({ width: image.bitmap.width, height: image.bitmap.height })
        );
  
        // Construct the imagesize query parameter
        const imageSizeParam = `imagesize:${imageDimensions.width}x${imageDimensions.height}`;
  
        let googleImageUrl = null;
        let tries = 0;
  
        while (!googleImageUrl && tries < 3) {
          // Search Google for an image related to the user-provided prompt with imagesize parameter
          const googleResponse = await axios.get(
            'https://www.googleapis.com/customsearch/v1',
            {
              params: {
                key: googleApiKey,
                cx: googleCseId,
                q: `${gprompt} ${imageSizeParam}`, // Add imagesize parameter to the query
                searchType: 'image',
              },
            }
          );
  
          const googleData = googleResponse.data;
  
          if (googleData.items && googleData.items.length > 0) {
            // Find the first image URL from Google Search that hasn't been used before
            for (const image of googleData.items) {
              if (!usedGoogleImageUrls.has(image.link)) {
                try {
                  // Attempt to read the image using Jimp
                  const searchedImage = await Jimp.read(image.link);
  
                  // Check if the dimensions of the searched image are within a range
                  const widthWithinRange =
                    Math.abs(
                      searchedImage.bitmap.width - imageDimensions.width
                    ) <= 50; // Adjust the range as needed
                  const heightWithinRange =
                    Math.abs(
                      searchedImage.bitmap.height - imageDimensions.height
                    ) <= 50; // Adjust the range as needed
  
                  if (widthWithinRange && heightWithinRange) {
                    googleImageUrl = image.link;
                    usedGoogleImageUrls.add(image.link);
                    break;
                  }
                } catch (readError) {
                  console.error('Error reading the image:', readError);
                  continue; // Skip this image and try the next one
                }
              }
            }
          }
  
          tries++;
        }
  
        if (googleImageUrl) {
          // Load the Google searched image using Jimp
          const searchedImage = await Jimp.read(googleImageUrl);
  
          // Resize the background-removed image to match the dimensions of the searched image
          bgRemovedImage.resize(
            searchedImage.bitmap.width,
            searchedImage.bitmap.height
          );
  
          // Composite the background-removed image on top of the Google searched image
          searchedImage.composite(bgRemovedImage, 0, 0);
  
          // Save the edited image temporarily
          const tempFilePath = path.join(
            __dirname,
            'temp',
            `${uuidv4()}_edited.png`
          );
          await searchedImage.writeAsync(tempFilePath);
  
          // Send the edited image as an attachment reply
          api.sendMessage(
            {
              attachment: fs.createReadStream(tempFilePath),
            },
            threadID,
            null,
            messageID
          );
  
          // Remove the temporary file after 5 seconds
          setTimeout(() => {
            fs.unlinkSync(tempFilePath);
          }, 5000);
        } else {
          return api.sendMessage(
            getLang(
              'longDescription',
              {},
              `No matching image found for "${gprompt}". Try again or change the prompt`
            ),
            threadID,
            messageID
          );
        }
      }
  
      
      if (isTextPrompt) {
        api.sendMessage('⏱ Editing as you want. Please wait ...', threadID, messageID);
        // Define the rainbow colors in the desired order
        const rainbowColors = ['#ff0000', '#ff6600', '#ffcc00', '#33cc33', '#0099ff', '#9900cc', '#ff0099'];
      
        const subtitleMatches = prompt.match(/text\s+([^|]*)(?:\|\s*(\d+))?\s*(?:\|\s*(\w+))?/i);
        const subtitleText = subtitleMatches ? subtitleMatches[1].trim() : ''; // Extract subtitle text
        const subtitleSize = subtitleMatches ? parseInt(subtitleMatches[2]) || 35 : 35; // Extract font size (default: 35)
        const subtitleColor = subtitleMatches ? subtitleMatches[3] || 'white' : 'white'; // Extract text color (default: white)
      
        // Load the image
        loadImage(imgurl).then(async (img) => {
          const canvas = createCanvas(img.width, img.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
      
          // Set subtitle text properties
          ctx.font = `${subtitleSize}px Arial`;

          
          ctx.textAlign = 'center';



                    // Add shadow to the text
          ctx.shadowColor = 'black'; // Shadow color
          ctx.shadowBlur = 2; // Shadow blur radius
          ctx.shadowOffsetX = 2; // Shadow offset X
          ctx.shadowOffsetY = 2; // Shadow offset Y
          // Calculate the position for the text (centered at the bottom)
          const textX = canvas.width / 2;
      
          // Calculate the position for the text at the bottom of the image
          const textY = canvas.height - subtitleSize;
      
          // Split the subtitle into multiple lines if it's too long
          const maxLineWidth = canvas.width - 40; // Adjust padding as needed
          const words = subtitleText.split(' ');
          let line = '';
          let lines = [];
      
          for (const word of words) {
            const testLine = line + (line === '' ? '' : ' ') + word;
            const testWidth = ctx.measureText(testLine).width;
      
            if (testWidth > maxLineWidth) {
              lines.push(line);
              line = word;
            } else {
              line = testLine;
            }
          }
      
          lines.push(line);
      
          // Calculate the total height of all lines
          const totalHeight = lines.length * subtitleSize;
      
          // Calculate the Y position for the first line to center the text
          const startY = textY - totalHeight / 2;
      
          // Create a gradient fill style for the text using rainbow colors
          const gradient = ctx.createLinearGradient(0, startY, 0, startY + totalHeight);
          for (let i = 0; i < rainbowColors.length; i++) {
            gradient.addColorStop(i / (rainbowColors.length - 1), rainbowColors[i]);
          }
      
          lines.forEach((line, index) => {
            // Use the rainbow gradient as the text fill style
            ctx.fillStyle = subtitleColor === 'rainbow' ? gradient : subtitleColor;
      
            const textYPosition = startY + (index * subtitleSize) + subtitleSize;
            ctx.fillText(line, textX, textYPosition, maxLineWidth);
          });
      
          const editedImageUrl = canvas.toDataURL();
          const tempFilePath = path.join(__dirname, 'temp', `${uuidv4()}_edited.png`);
          const buffer = canvas.toBuffer('image/png');
          fs.writeFileSync(tempFilePath, buffer);
      
          api.sendMessage(
            {
              attachment: fs.createReadStream(tempFilePath),
            },
            threadID,
            null,
            messageID
          );
      
          setTimeout(() => {
            fs.unlinkSync(tempFilePath);
          }, 5000);
        }).catch((error) => {
          console.error('Error processing image:', error);
          api.sendMessage(
            getLang('longDescription', {}, 'An error occurred while processing the image. Try again or contact the creator'),
            threadID,
            messageID
          );
        });
      }
      
    
      // Rest of your code remains unchanged
  
    } catch (error) {
      console.error('Error fetching or processing the image:', error);
      api.sendMessage(
        getLang('longDescription', {}, 'An error occurred while processing the image. Try again or contact the creator'),
        threadID,
        messageID
      );
    }
  },
};






/*
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// ... Your other imports ...

const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: 'edit',
    version: '1.0.0',
    author: 'ntf',
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: 'Chỉnh sửa hình ảnh',
      en: 'Edit images with a specified prompt',
    },
    longDescription: {
      vi: 'Chỉnh sửa hình ảnh dựa trên câu hỏi của bạn.',
      en: 'Edit images based on your question.',
    },
    category: 'edit-img',
    guide: {
      vi: 'Hãy reply vào một hình ảnh bằng `edit with [prompt]`',
      en: 'Please reply to an image with `edit with [prompt]`',
    },
  },

  langs: {
      vi: {
        hello: 'xin chào',
        helloWithName: 'xin chào, id facebook của bạn là %1',
        shortDescription: 'Edit images with a specified prompt',
      },
      en: {
        hello: 'hello world',
        helloWithName: 'hello, your facebook id is %1',
        shortDescription: 'Edit images with a specified prompt',
      },
  },
  onStart: async function ({
    api,
    event,
    message,
    args,
    getLang,
    threadsData,
    usersData,
    dashBoardData,
    globalData,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    role,
    commandName,
  }) {
    const { threadID, messageID, body } = event;

    // Check if the message is a reply with an attachment
    if (!event.messageReply || event.messageReply.attachments.length === 0) {
      return api.sendMessage(
        getLang('guide', { prompt: commandName }),
        threadID,
        messageID
      );
    }

    const imgurl = event.messageReply.attachments[0].url; // Moved this line after the check

    // Check if the user's input contains "with"
    if (body.includes('with')) {
      const prompt = body.slice(body.indexOf('with') + 4).trim(); // Extract the user-provided prompt

      // Your "edit with" functionality here

      // Example: Remove the background and perform other image editing

      api.sendMessage('⏱ Editing as you want. Please wait ...', threadID, messageID);
      api.sendMessage(prompt, threadID, messageID);
      try {
        // Rest of your "edit with" code

        // ...

        // Send the edited image as an attachment reply

        // ...

      } catch (error) {
        console.error('Error processing the image:', error);
        api.sendMessage(
          getLang(
            'longDescription',
            {},
            'An error occurred while processing the image. Try again or contact the creator'
          ),
          threadID,
          messageID
        );
      }
    } else if (body.includes('text')) {
      // Check if the user's input contains "text"
      const inputParts = body.split('|').map(part => part.trim());
      const prompt = inputParts[0].slice(body.indexOf('text') + 4).trim(); // Extract the user-provided prompt

      // Example: Add subtitles to the image
      api.sendMessage('⏱ Adding subtitles. Please wait ...', threadID, messageID);

      try {
        // Default values for text size, color, and shadow
        let textSize = '24px';
        let textColor = 'white';
        let textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';

        // Check if the user provided size, color, and shadow values
        if (inputParts.length >= 2) {
          const sizePart = inputParts[1].toLowerCase();
          if (sizePart.endsWith('px')) {
            textSize = sizePart;
          }
        }

        if (inputParts.length >= 3) {
          const colorPart = inputParts[2].toLowerCase();
          if (/^(#?[0-9a-fA-F]{6}|#?[0-9a-fA-F]{3})$/.test(colorPart)) {
            textColor = colorPart;
          }
        }

        if (inputParts.length >= 4) {
          textShadow = inputParts[3];
        }

        // Download the image from the URL
        const response = await axios.get(imgurl, { responseType: 'arraybuffer' });

        if (response.status === 200) {
          // Load the image using canvas
          const image = await loadImage(response.data);
          const canvas = createCanvas(image.width, image.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);

          // Configure text properties with the user's prompt for subtitles
          ctx.font = textSize + ' "Your Bengali Font"'; // Use the registered Bengali font
          ctx.fillStyle = textColor; // Text color
          ctx.shadowColor = 'black'; // Shadow color
          ctx.shadowBlur = 10; // Shadow blur
          ctx.shadowOffsetX = 5; // Shadow X offset
          ctx.shadowOffsetY = 5; // Shadow Y offset
          ctx.textAlign = 'center'; // Horizontal alignment
          ctx.textBaseline = 'bottom'; // Vertical alignment

          // Calculate text position
          const x = canvas.width / 2;
          const y = canvas.height - 20;

          // Add text to the canvas
          ctx.fillText(prompt, x, y);

          // Save the edited image temporarily
          const tempFilePath = path.join(
            __dirname,
            'temp',
            `${uuidv4()}_edited.png`
          );

          const writableStream = fs.createWriteStream(tempFilePath);
          const stream = canvas.createPNGStream();
          stream.pipe(writableStream);

          writableStream.on('finish', () => {
            // Send the edited image with subtitles as an attachment reply
            api.sendMessage(
              {
                attachment: fs.createReadStream(tempFilePath),
              },
              threadID,
              null,
              messageID
            );

            // Remove the temporary file after 5 seconds
            setTimeout(() => {
              fs.unlinkSync(tempFilePath);
            }, 5000);
          });
        } else {
          api.sendMessage('Failed to download the image for processing.', threadID, messageID);
        }
      } catch (error) {
        console.error('Error adding subtitles to the image:', error);
        api.sendMessage(
          getLang(
            'longDescription',
            {},
            'An error occurred while adding subtitles to the image. Try again or contact the creator'
          ),
          threadID,
          messageID
        );
      }
    } else {
      // If neither "with" nor "text" is found, show the guide
      api.sendMessage(
        getLang('guide', { prompt: commandName }),
        threadID,
        messageID
      );
    }
  },
};

----------------------------------------------------------------------


const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const Jimp = require('jimp');

// Replace with your Google API key and CSE ID
const googleApiKey = 'AIzaSyBCsuQ6EFUCR22TqRYAQWewMCCUyMxONQc';
const googleCseId = '138b2f6dab3ef4734';

// Create a Set to keep track of used image URLs from Google Search
const usedGoogleImageUrls = new Set();

module.exports = {
  config: {
    name: 'edit',
    version: '1.0.0',
    author: 'ntf',
    countDown: 0,
    role: 0,
    shortDescription: {
      vi: 'Chỉnh sửa hình ảnh',
      en: 'Edit images with a specified prompt',
    },
    longDescription: {
      vi: 'Chỉnh sửa hình ảnh dựa trên câu hỏi của bạn.',
      en: 'Edit images based on your question.',
    },
    category: 'edit-img',
    guide: {
      vi: 'Hãy reply vào một hình ảnh bằng `edit with [prompt]`',
      en: 'Please reply to an image with `edit with [prompt]`',
    },
  },

  langs: {
      vi: {
        hello: 'xin chào',
        helloWithName: 'xin chào, id facebook của bạn là %1',
        shortDescription: 'Edit images with a specified prompt',
      },
      en: {
        hello: 'hello world',
        helloWithName: 'hello, your facebook id is %1',
        shortDescription: 'Edit images with a specified prompt',
      },
  },

  onStart: async function ({
    api,
    event,
    message,
    args,
    getLang,
    threadsData,
    usersData,
    dashBoardData,
    globalData,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    role,
    commandName,
  }) {
    const { threadID, messageID } = event;

    // Check if the message is a reply with an attachment
    if (!event.messageReply || event.messageReply.attachments.length === 0) {
      return api.sendMessage(
        getLang('guide', { prompt: commandName }),
        threadID,
        messageID
      );
    }

    // Get the URL of the replied image
    const imgurl = event.messageReply.attachments[0].url;
    const prompt = event.body.slice(commandName.length + 1).trim(); // Extract the user-provided prompt

    api.sendMessage('⏱ Editing as you want. Please wait ...', threadID, messageID);

    try {
      // Construct the image URL for remove.bg
      const removeBgUrl = 'https://api.remove.bg/v1.0/removebg';

      // Create a FormData object and append the image_url parameter
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_url', imgurl);

      // Send a POST request to remove.bg API to remove the background
      const response = await axios({
        method: 'post',
        url: removeBgUrl,
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': 'QJm2xgebVs8PUgBKwW4AixZH', // Your remove.bg API key
        },
        encoding: null,
      });

      // Load the background-removed image using Jimp
      const bgRemovedImage = await Jimp.read(Buffer.from(response.data));

      // Extract the dimensions (height and width) of the input image
      const imageDimensions = await Jimp.read(Buffer.from(response.data)).then(
        (image) => ({ width: image.bitmap.width, height: image.bitmap.height })
      );

      // Construct the imagesize query parameter
      const imageSizeParam = `imagesize:${imageDimensions.width}x${imageDimensions.height}`;

      let googleImageUrl = null;
      let tries = 0;

      while (!googleImageUrl && tries < 3) {
        // Search Google for an image related to the user-provided prompt with imagesize parameter
        const googleResponse = await axios.get(
          'https://www.googleapis.com/customsearch/v1',
          {
            params: {
              key: googleApiKey,
              cx: googleCseId,
              q: `${prompt} ${imageSizeParam}`, // Add imagesize parameter to the query
              searchType: 'image',
            },
          }
        );

        const googleData = googleResponse.data;

        if (googleData.items && googleData.items.length > 0) {
          // Find the first image URL from Google Search that hasn't been used before
          for (const image of googleData.items) {
            if (!usedGoogleImageUrls.has(image.link)) {
              try {
                // Attempt to read the image using Jimp
                const searchedImage = await Jimp.read(image.link);

                // Check if the dimensions of the searched image are within a range
                const widthWithinRange =
                  Math.abs(
                    searchedImage.bitmap.width - imageDimensions.width
                  ) <= 50; // Adjust the range as needed
                const heightWithinRange =
                  Math.abs(
                    searchedImage.bitmap.height - imageDimensions.height
                  ) <= 50; // Adjust the range as needed

                if (widthWithinRange && heightWithinRange) {
                  googleImageUrl = image.link;
                  usedGoogleImageUrls.add(image.link);
                  break;
                }
              } catch (readError) {
                console.error('Error reading the image:', readError);
                continue; // Skip this image and try the next one
              }
            }
          }
        }

        tries++;
      }

      if (googleImageUrl) {
        // Load the Google searched image using Jimp
        const searchedImage = await Jimp.read(googleImageUrl);

        // Resize the background-removed image to match the dimensions of the searched image
        bgRemovedImage.resize(
          searchedImage.bitmap.width,
          searchedImage.bitmap.height
        );

        // Composite the background-removed image on top of the Google searched image
        searchedImage.composite(bgRemovedImage, 0, 0);

        // Save the edited image temporarily
        const tempFilePath = path.join(
          __dirname,
          'temp',
          `${uuidv4()}_edited.png`
        );
        await searchedImage.writeAsync(tempFilePath);

        // Send the edited image as an attachment reply
        api.sendMessage(
          {
            attachment: fs.createReadStream(tempFilePath),
          },
          threadID,
          null,
          messageID
        );

        // Remove the temporary file after 5 seconds
        setTimeout(() => {
          fs.unlinkSync(tempFilePath);
        }, 5000);
      } else {
        return api.sendMessage(
          getLang(
            'longDescription',
            {},
            `No matching image found for "${prompt}". Try again or change the prompt`
          ),
          threadID,
          messageID
        );
      }
    } catch (error) {
      console.error('Error fetching or processing the image:', error);
      api.sendMessage(
        getLang('longDescription', {}, 'An error occurred while processing the image. Try again or contact the creator'),
        threadID,
        messageID
      );
    }
  },
};

*/