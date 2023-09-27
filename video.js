let axios = require("axios");
let fs = require("fs-extra");
let ytdl = require("ytdl-core");
let yts = require("yt-search");

module.exports = {
  config: {
    name: "video",
    version: "1.0",
    author: "JARiF",
    countDown: 5,
    role: 0,
    category: "box chat",
    guide: {
      en: "{p}video fb [link]\n{p}video yt [name]\n{p}video insta [name]",
    },
  },

  onStart: async function ({ args, message }) {
    let lang = {
      missingUrl: "Missing URL.",
      downloading: "Downloading...",
      error: "Error: An error occurred.",
      tooLarge: "Error: The file is too large to handle.",
      invalidSource: "Invalid source.",
      noVideoLink: "Please enter a video link.",
      noVideoName: "Please provide a video name.",
      songNotFound: "Error: Invalid request.",
      processingError: "An error occurred while processing the command.",
      videoNotFound: "Video not found.",
    };

    if (!args[0]) {
      return message.reply(lang.missingUrl);
    }

    try {
  if (args[0].startsWith("fb")) {
    let response = await axios.get(`https://samirthakuri.restfulapi.repl.co/fbdownload?apikey=samirey&url=${args[1]}`);

    if (!response.data.success) {
      return message.reply(lang.error);
    }

    let msgSend = await message.reply(lang.downloading);

    try {
      let stream = await global.utils.getStreamFromURL(response.data.url2);
      await message.reply({ attachment: stream });
    } catch (downloadError) {
      console.error('[DOWNLOAD ERROR]', downloadError);
      return message.reply(lang.error); // Send an error message to the user if download fails
    }

    await msgSend.delete();
      } else if (args[0].startsWith("yt")) {
        let input = args.slice(1).join(" ");
        if (!input) {
          return message.reply(lang.noVideoName);
        }

        try {
          let Send = await message.reply(`Searching for the song "${input}"`);

          let searchResults = await yts(input);
          if (!searchResults.videos.length) {
            return message.reply(lang.songNotFound);
          }

          let video = searchResults.videos[0];
          let videoUrl = video.url;

          let stream = ytdl(videoUrl, { filter: "videoandaudio" });

          let fileName = `music.mp4`;
          let filePath = __dirname + `/cache/${fileName}`;

          stream.pipe(fs.createWriteStream(filePath));

          stream.on('response', () => {
            console.info('[DOWNLOADER]', 'Starting download now!');
          });

          stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
          });

          
stream.on('end', async () => {
  console.info('[DOWNLOADER] Downloaded');

  if (fs.statSync(filePath).size > 26214400) {
    fs.unlinkSync(filePath);
    return message.reply('The file could not be sent because it is larger than 25MB.');
  }

  let sendObj = {
    body: `Title: ${video.title}\nArtist: ${video.author.name}`,
    attachment: fs.createReadStream(filePath)
  };

  message.reply(sendObj, () => {
    fs.unlinkSync(filePath);
  });
});
        } catch (error) {
          console.error('[ERROR]', error);
          message.reply(lang.processingError);
        }
      } else if (args[0].startsWith("insta")) {
        let name = args.slice(1).join(" ");
        if (!name) {
          return message.reply(lang.noVideoLink);
        } else {
          let BASE_URL = `https://www.nguyenmanh.name.vn/api/igDL?url=${encodeURIComponent(name)}&apikey=SyryTUZn`;

          await message.reply(lang.downloading);

          try {
            let res = await axios.get(BASE_URL);
            let title = res.data.result.title;
            let img = res.data.result.video[0].url;

            let form = {
              body: `${title}`
            };

            if (img) {
              form.attachment = await global.utils.getStreamFromURL(img);
            }

            message.reply(form);
          } catch (e) {
            message.reply(lang.videoNotFound);
            console.log(e);
          }
        }
      } else {
        return message.reply(lang.invalidSource);
      }
    } catch (e) {
      return message.reply(lang.tooLarge);
    }
  },
};