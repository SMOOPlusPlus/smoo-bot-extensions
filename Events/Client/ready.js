const { activity } = require("../../config/config.json")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        client.user.setPresence({ 
            activities: [{ name: activity.name, type: activity.type }],
            status: activity.status 
          })
        console.log(`${client.logger.gettime()} [${client.user?.username}]: Connected to Discord`)
    }
}