const { Queue, Song } = require("distube");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    queue.textChannel?.send(`➕ Added **${song.name}** to the queue.`);
}
