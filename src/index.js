require('dotenv').config()

const { Client, IntentsBitField } = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

client.on('clientReady', (c) => {
    console.log(`[DISCORD BOT] ${c.user.tag} status is ready.`)
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    console.log(interaction.commandName)

    // if (interaction.commandName === 'hey') {
    //     interaction.reply('hey!')
    // }
    //
    // if (interaction.commandName === 'ping') {
    //     interaction.reply('Pong!')
    // }

    if (interaction.commandName === 'add') {
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum is ${num1 + num2}`)
    }
})

// client.on('messageCreate', (message) => {
//
//     if (message.author.bot) {
//         return
//     }
//     // console.log(message)
//     // console.log(message.content)
//
//     if (message.content.toLowerCase() === 'hello') {
//         message.reply('hello')
//     }
// })

client.login(process.env.BOT_TOKEN)
