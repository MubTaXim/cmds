

module.exports = {
	config: {
		name: "antiout",
		version: "1.0",
		author: "NIB",
		countDown: 1,
		role: 0,
		shortDescription: "Enable/disable antiout",
		longDescription: "",
		category: "boxcontrol",
		guide: "{pn} {{[on | off]}}",
		envConfig: {
			deltaNext: 5
		}
	},
  

	onStart: async function ({ message, event, threadsData, args }) {
let antiout = await threadsData.get(event.threadID, "settings.antiOut");
		
			
    if(antiout === undefined){
      await threadsData.set(event.threadID, true, "settings.antiOut");
    }
    console.log(await threadsData.get(event.threadID, "settings.reSend"))
		if (!["on", "off"].includes(args[0]))
			return message.reply("on or off")
		await threadsData.set(event.threadID, args[0] === "on", "settings.antiOut");
    
		return message.reply(`Is already ${args[0] === "on" ? "turn on" : "Turn off"}`);
	}



  
}