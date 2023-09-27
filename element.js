const axios = require('axios');

module.exports = {
  config: {
    name: "element",
    aliases: ["ptable"],
    version: "1.0",
    author: "Munem",
    countDown: 35,
    role: 0,
    shortDescription: "get element data",
    longDescription: "search and get element info",
    category: "study",
    guide: "{pn} {{<name>}}"
  },

  onStart: async function ({ message, args }) {
    const name = args.join(" ");
    if (!name)
      return message.reply(`Invalid element, please enter a valid element symbol, name, or atomic number.`);
    else {
      const BASE_URL = `https://api.popcat.xyz/periodic-table?element=${name}`;
      try {
        let res = await axios.get(BASE_URL);

        let element = res.data.element;
        let symbol = res.data.symbol;
        let atomic_number = res.data.atomic_number;
        let atomic_mass = res.data.atomic_mass;
        let period = res.data.period;
        let phase = res.data.phase;
        let discovered_by = res.data.discovered_by;
        let summary = res.data.summary;
        let img = res.data.image;

        const form = {
          body: `===「 Element Info 」===`
            + `\nName: ${element}`
            + `\nSymbol: ${symbol}`
            + `\nAtomic Number: ${atomic_number}`
            + `\nAtomic Mass: ${atomic_mass}`
            + `\nPeriod: ${period}`
            + `\nPhase: ${phase}`
            + `\n\nDiscovered by: ${discovered_by}`
            + `\n\nSummary: ${summary}`
        };
        if (img)
          form.attachment = await global.utils.getStreamFromURL(img);
        message.reply(form);
      } catch (e) {
        message.reply(`Not Found`);
      }
    }
  }
};
