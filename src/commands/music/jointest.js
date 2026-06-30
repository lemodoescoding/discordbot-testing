const {
	Client,
	ChatInputCommandInteraction,
	MessageFlags,
} = require("discord.js");

const {
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
	name: "jointest",
	description: "Test Discord voice connection.",

	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const voiceChannel = interaction.member.voice.channel;

		if (!voiceChannel) {
			return interaction.reply({
				content: "Join a voice channel first.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		await interaction.deferReply();

		console.log("Joining:", voiceChannel.name);

		console.log("Adapter:", typeof voiceChannel.guild.voiceAdapterCreator);

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

		console.log("Join created.");
		console.log(connection.state.status);

		console.log("Networking:", connection.state.networking);

		connection.on("stateChange", (oldState, newState) => {
			console.log(
				`Voice State: ${oldState.status} -> ${newState.status}`,
			);
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 30000);

			console.log("✅ Voice Ready!");

			await interaction.editReply("✅ Successfully connected to voice!");
		} catch (err) {
			connection.on("error", console.error);

			connection.on("debug", console.log);

			connection.destroy();

			await interaction.editReply(
				`❌ Failed.\n\n\`\`\`\n${err.stack}\n\`\`\``,
			);
		}
	},
};
