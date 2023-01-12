function loadEvents(client) {
    const fs = require("fs")
    const { eventLogs } = require("./logger.js")

    const folders = fs.readdirSync("./Events")
    for (const folder of folders) {
        const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"))

        for (const file of files) {
            if(file.endsWith(".dl" || ".disabled")) return
            const event = require(`../Events/${folder}/${file}`)
            if(event.rest) {
                if(event.once) {
                    client.rest.once(event.name, (...args) => event.execute(...args, client))
                } else {
                    client.rest.on(event.name, (...args) => event.execute(...args, client))
                }
            } else {
                if(event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client))
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client))
                }
            }
            eventLogs(file, "✅")
            continue
        }
    }
}

module.exports = { loadEvents }