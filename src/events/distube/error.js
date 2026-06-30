const { Queue } = require("distube")

/**
 * @param {Queue} queue
 * @param {Error} error
 * */
module.exports = (queue, error) => {
    console.error(error);

    queue?.textChannel?.send(`❌ ${error.message}`);
}
