const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { loadEvents } = require("../../Handlers/Events.js")
const { loadSlashCommands } = require("../../Handlers/CommandHandler.js")

module.exports = {
  //uncomment first line before the first release
  //developer: true,
  data: new SlashCommandBuilder()
  .setName("reload")
  .setDescription("reload the events/commands")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((options) => options.setName("events").setDescription("Reload the events"))
  .addSubcommand((options) => options.setName("commands").setDescription("Reload the commands")),
     /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
  async execute(interaction, client) {
    switch(interaction.options.getSubcommand()) {
        case "events": 
          loadEvents(client)
          interaction.reply({ content: "Reloaded Events" })
        break

        case "commands": 
          loadSlashCommands(client)
          interaction.reply({ content: "Reloaded Commands" })
        break
    }
  }
}