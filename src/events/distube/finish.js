const { Queue } = require("distube");

/**
 * @param {Queue} queue
 * */
module.exports = (queue) => {
    queue.textChannel?.send("✅ Queue finished. Leaving the voice channel.");
}
