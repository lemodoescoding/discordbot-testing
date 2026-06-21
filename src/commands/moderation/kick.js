const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kick a member on the server.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'Kick a member!!!!',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'Reason to kick user.',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [
        PermissionFlagsBits.KickMembers
    ],
    botPermissions: [
        PermissionFlagsBits.KickMembers
    ],
    /** 
     * @param {Client} client
     * @param {Interaction} interaction 
     * */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided.";

        await interaction.deferReply();
        const targetUser = await interaction.guild.members.fetch(targetUserId)

        if(!targetUserId) {
            await interaction.editReply("That user doesnt exist in this server");
            return;
        }

        if(targetUserId === interaction.guild.ownerId) {
            await interaction.editReply("You can't kick that user because they're the server owner");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user, because they have the same/higher role than you.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user, because they have the same/higher role than me.");
            return;
        }

        try {
            await targetUser.kick({ reason })
            await interaction.editReply(`User ${targetUser} was kicked\n Reason: ${reason}`)
        } catch (error) {
            console.log(`There was an error when kicking: ${error}`)
        }
        // interaction.reply(`ban! ${client.ws.ping}ms`)
    }
}
