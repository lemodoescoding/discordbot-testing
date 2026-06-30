const { EmbedBuilder } = require("discord.js");

/**
 * @param {import("distube").Song} song
 * */
module.exports = (song) => {
    return new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("🎵 Now Playing")
        .setURL(song.url)
        .setDescription(`**${song.name}**`)
        .setThumbnail(song.thumbnail)
        .addFields(
            {
                name: "Duration",
                value: song.formattedDuration,
                inline: true
            },
            {
                name: "Requested by",
                value: `${song.user}`,
                inline: true
            }
        );
}
