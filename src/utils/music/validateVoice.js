const {
	MessageFlags,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
	VoiceBasedChannel,
} = require("discord.js");

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {Boolean} needsQueue
 *
 * @returns {Promise<{
 *  voiceChannel: import("discord.js").VoiceBasedChannel,
 *  queue: import("distube").Queue | null
 * } | null>}
 * */
module.exports = async (interaction, needsQueue = true) => {
	/**
	 * @type {VoiceBasedChannel | null}
	 * */
	const voiceChannel = interaction.member.voice.channel;

	if (!voiceChannel) {
		await interaction.reply({
			content: "You must join a voice channel first!.",
			flags: [MessageFlags.Ephemeral],
		});

		return null;
	}

	const me =
		interaction.guild.members.me ??
		(await interaction.guild.members.fetchMe());
	const permissions = voiceChannel.permissionsFor(
        me
	);

	if (
		!permissions.has(PermissionFlagsBits.Speak) ||
		!permissions.has(PermissionFlagsBits.Connect)
	) {
		await interaction.reply({
			content:
				"I don't have permission to join or speak in your voice channel.",
			flags: [MessageFlags.Ephemeral],
		});

		return null;
	}

	/**
	 * @type {import("discord.js").Client & {
	 *   distube: import("distube").DisTube
	 * }}
	 */
	const client = interaction.client;
	const queue = client.distube.getQueue(interaction.guildId);

	if (needsQueue && !queue) {
		await interaction.reply({
			content: "Nothing is currently playing.",
			flags: [MessageFlags.Ephemeral],
		});

		return null;
	}

	if (
		queue &&
		interaction.guild.members.me.voice.channelId !== voiceChannel.id
	) {
		await interaction.reply({
			content: "You must be in the same voice as me.",
			flags: [MessageFlags.Ephemeral],
		});

		return null;
	}

	return { voiceChannel, queue };
};
