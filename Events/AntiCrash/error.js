const webhooks = require("../../config/webhooks.json")

module.exports = {
    name: "error",
    once: false,
    async execute(err, client) {

        console.log(err);

        if(client.config.anticrash === true) return

        let webhook = new WebhookClient({
            id: webhooks.anticrash.id,
            token: webhooks.anticrash.token
        })

        let embed = new EmbedBuilder()
        embed.setColor("Red")
        embed.setTitle("Discord API Error")
        embed.setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
        embed.setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
        embed.setTimestamp();

        return webhook.send({ embeds: [embed] });
    }
}