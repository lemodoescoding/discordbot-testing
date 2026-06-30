const {
	ChatInputCommandInteraction,
	Client,
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
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return interaction.reply({
				content: "Join a voice channel first.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		await interaction.deferReply();

		console.log("Joining:", channel.name);

		console.log({
			guildId: channel.guild.id,
			channelId: channel.id,
			adapter: typeof channel.guild.voiceAdapterCreator,
		});

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: true,
		});

		// setInterval(() => {
		// 	console.log(connection.state);
		// }, 1000);

		connection.on("stateChange", (oldState, newState) => {
			console.log(
				`Voice State: ${oldState.status} -> ${newState.status}`,
			);
		});

		connection.on("debug", console.log);

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 30000);

			console.log("Connected!");

			await interaction.editReply(
				"✅ Voice connection established successfully.",
			);

			connection.destroy();
		} catch (err) {
			console.error(err);

			await interaction.editReply(
				`❌ Failed.\n\`\`\`\n${err.stack}\n\`\`\``,
			);

			connection.destroy();
		}
	},
};
