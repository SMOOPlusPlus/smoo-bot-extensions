const { CommandInteraction, MessageEmbed, WebhookClient } = require("discord.js")
const { client } = require("../../Structures/main.js")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return

        const command = client.commands.get(interaction.commandName)

        if(!command) {
            return interaction.reply({content: "This command is outdated", ephemeral: true})
        }

        command.execute(interaction, client)
    }
}