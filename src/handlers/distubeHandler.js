const { DisTube } = require("distube");
const { Client } = require("discord.js");
const { YouTubePlugin } = require("@distube/youtube");

const getAllFiles = require("../utils/getAllFiles");
const path = require("path");

/**
 * @param {import("discord.js").Client & {
 *   distube: import("distube").DisTube
 * }} client
 * */
module.exports = (client) => {
	client.distube = new DisTube(client, {
		plugins: [new YouTubePlugin()],
		emitNewSongOnly: true,
	});

	client.distube.on("debug", console.log);
	client.distube.on("ffmpegDebug", console.log);

	const eventFiles = getAllFiles(
		path.join(__dirname, "..", "events", "distube"),
	);

	for (const file of eventFiles) {
		const event = require(file);

		const eventName = path.basename(file, ".js");

		client.distube.on(eventName, event);
	}

	console.log("[DISCORD BOT] Distube initialized.");
};
