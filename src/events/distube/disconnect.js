const { Queue } = require("distube");

/**
 * @param {Queue} queue
 */
module.exports = (queue) => {
	queue.textChannel?.send("👋 Disconnected from the voice channel.");
};
