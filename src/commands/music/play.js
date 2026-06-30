const {
	ApplicationCommandOptionType,
	Client,
	ChatInputCommandInteraction,
	MessageFlags,
	VoiceBasedChannel,
    PermissionFlagsBits
} = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");

module.exports = {
	name: "play",
	description: "Play a song",
	options: [
		{
			name: "query",
			description: "Song name or URL",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	/**
	 * @param {import("discord.js").Client & {
	 *   distube: import("distube").DisTube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
        const music = await validateVoice(interaction, false);

        if (!music) return;

        const { voiceChannel } = music;

		const query = interaction.options.getString("query", true);

		await interaction.deferReply();


		try {
			await client.distube.play(voiceChannel, query, {
                interaction,
				member: interaction.member,
				textChannel: interaction.channel,
			});

            await interaction.deleteReply()
		} catch (error) {
			await interaction.editReply({
                content: `Failed to play music.\n\`${error.message}\`\n${error.stack}`,
            });
		}
	},
};
