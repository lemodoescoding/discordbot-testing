const {
	ApplicationCommandOptionType,
	Client,
	Interaction,
	AttachmentBuilder,
} = require("discord.js");

const canvacord = require("canvacord");

const fs = require("fs");

const Level = require("../../models/Level");
const calculateLevelXP = require("../../utils/calculateLevelXP.js");
const generateRankCard = require("../../utils/generateRankCard.js");

module.exports = {
	name: "level",
	description: "Shows your/someone's level.",
	options: [
		{
			name: "target-user",
			description: "The user whose level you want to see.",
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("You can only run this command inside a server.");
			return;
		}

		await interaction.deferReply();

		try {
			const mentionedUserId =
				interaction.options.get("target-user")?.value;
			const targetUserId = mentionedUserId || interaction.member.id;

			const targetUserObject =
				await interaction.guild.members.fetch(targetUserId);

			const fetchedLevel = await Level.findOne({
				userId: targetUserId,
				guildId: interaction.guild.id,
			});

			if (!fetchedLevel) {
				interaction.editReply(
					mentionedUserId
						? `${targetUserObject.user.tag} doesnt have any levels yet. Try again when they chat a little more.`
						: "You don't have any levels yet. Chat a little more and try again.",
				);

				return;
			}

			let allLevels = await Level.find({
				guildId: interaction.guild.id,
			}).select("-_id userId level xp");

			allLevels.sort((a, b) => {
				if (a.level === b.level) {
					return b.xp - a.xp;
				} else {
					return b.level - a.level;
				}
			});

			let currentRank =
				allLevels.findIndex((lvl) => {
					return lvl.userId === targetUserId;
				}) + 1;

			// const rank = new canvacord.RankCardBuilder()
			// 	.setAvatar("./temp-avatar.png")
			// 	.setRank(currentRank)
			// 	.setLevel(fetchedLevel.level)
			// 	.setCurrentXP(fetchedLevel.xp)
			// 	.setRequiredXP(calculateLevelXP(fetchedLevel.level))
			// 	// .setProgressBar("#FFC300", "COLOR")
			// 	.setStatus(targetUserObject.presence.status)
			// 	.setUsername(targetUserObject.user.username);
			// const rank = new canvacord.RankCardBuilder()
			// 	.setAvatar(avatarBuffer)
			// 	.setRank(1)
			// 	.setLevel(1)
			// 	.setCurrentXP(50)
			// 	.setRequiredXP(100)
			// 	.setUsername("test");

            const image = await generateRankCard({
                user: targetUserObject.user,
                levelData: fetchedLevel,
                rank: currentRank
            })

			const attachment = new AttachmentBuilder(image, { name: "rank.png" });

			interaction.editReply({ files: [attachment] });

		} catch (error) {
			console.log(
				`There was an error when showing the level command: ${error}`,
			);
		}
	},
};
