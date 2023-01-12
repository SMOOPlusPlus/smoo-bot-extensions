async function loadSlashCommands(client) {
    const fs = require("fs")
    const { commandLogs } = require("./logger.js")

    let commandsArray = []
    let developerArray = []

    const commandsFolders = fs.readdirSync("./Commands")

    for (const folder of commandsFolders) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`)
        .filter((file) => file.endsWith(".js"))

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`)

            client.commands.set(commandFile.data.name, commandFile)

            if(commandFile.developer) developerArray.push(commandFile.data.toJSON())
            else commandsArray.push(commandFile.data.toJSON())

            commandLogs(file, "✅")
            continue
        }
    }
    let guild = null
    let developerguild = client.guilds.cache.get(client.config.guilds.developerguild)
    if(client.config.debug === true) {
        guild = await client.guilds.cache.get(client.config.guilds.developerguild);
    } else {
        guild = await client.guilds.cache.get(client.config.guilds.mainguild);
    }
    guild.commands.set(commandsArray)

    //uncomment line below before the first release
    //developerguild.commands.set(developerArray)


}

module.exports = { loadSlashCommands }