/**
 * @param {import("discord.js").Client & {
 *   distube: import("distube").DisTube
 * }} client
 * @param {string} guildId
 *
 * @returns {import("distube").Queue | null}
 */
module.exports = (client, guildId) => {
    return client.distube.getQueue(guildId)
}
