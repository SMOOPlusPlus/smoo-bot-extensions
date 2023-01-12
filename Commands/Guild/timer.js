const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timer")
        .setDescription("Timer Command")
        .addSubcommand((subcommand) => subcommand.setName("start").setDescription("Start a repeating hint reminder timer")
        .addIntegerOption((options) => options.setName("time").setDescription("Time to countdown").setRequired(true))
        .addBooleanOption((options) => options.setName("multi").setDescription("Fire the timer repeatedly?").setRequired(true))
        .addUserOption((options) => options.setName("seeker1").setDescription("The First Seeker/Only Seeker").setRequired(false))
        .addUserOption((options) => options.setName("seeker2").setDescription("The Second Seeker").setRequired(false))
        .addUserOption((options) => options.setName("seeker3").setDescription("The Third Seeker").setRequired(false))
        .addUserOption((options) => options.setName("seeker4").setDescription("The Fourth Seeker").setRequired(false)))
        .addSubcommand((subcommand) => subcommand.setName("cancels").setDescription("Cancels all running hint reminder timers")),
    /**
    * @param {ChatInputCommandInteraction} interaction 
    * @param {Client} client
    */
    async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "start":
                let seeks = [interaction.options.getUser("seeker1"), interaction.options.getUser("seeker2"), interaction.options.getUser("seeker3"), interaction.options.getUser("seeker4")]
                seeks = seeks.filter((x, i, s) => {
                    return s.indexOf(x) === i && x != null;
                });
                const milisecondtime = interaction.options.getInteger("time")
                const time = milisecondtime * 1000

                if (seeks.length == 0) seeks.push(interaction.user);

                interaction.reply({ content: "Timer Started go hide" })

                let multi = interaction.options.getBoolean("multi");
                let runGuildId = interaction.guild.id;

                let timerFunc = (myTimer) => {
                    //let ind = client.timerList.map((x, i, s) => x.guildid).indexOf(timerObj);
                    let ind = -1;
                    for (let i = 0; i < client.timerList.length; i++) {
                        if (client.timerList[i].guildid === runGuildId && client.timerList[i].timer === myTimer) {
                            ind = i;
                            break;
                        }
                    }
                    if (ind != -1) {
                        interaction.channel.send(seeks.map(x => `<@${x.id}>`).join(", ") + `, it has been ${milisecondtime} seconds`);
                        if (multi) {
                            let ret = setTimeout(() => timerFunc(ret), time); //continue the timer
                            client.timerList.push({
                                "timer": ret,
                                "guildid": runGuildId
                            });
                        }
                    }
                    if (ind != -1) {
                        client.timerList.splice(ind, 1);
                    }
                };

                let ret = setTimeout(() => timerFunc(ret), time); //start the timer
                client.timerList.push({
                    "timer": ret,
                    "guildid": runGuildId
                });
                break;
            case "cancels":
                let cancelCount = 0;
                for (let tm in client.timerList.filter((x, i, s) => {
                    if (x.guildid === interaction.guild.id) {
                        cancelCount++;
                        return true;
                    }
                    else return false;
                })) {
                    clearTimeout(tm.timer); //cancel only this guild's timers
                }
                interaction.reply("Cancelling all running timers... (Count: " + client.timerList.length + ")");
                client.timerList = client.timerList.filter((x, i, s) => {
                    return x.guildid != interaction.guild.id; //filter out this guild's timers
                });
                break;
        }
    }
}
