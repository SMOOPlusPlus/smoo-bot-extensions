const { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { createCanvas, Image } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { request } = require('undici');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("spinwheel")
  .setDescription("Spinwheel for the kingdom/seeker")
  .addSubcommand((subcommand) => subcommand.setName("seeker").setDescription("The Spinwheel for the seeker(s)")
  //.addIntegerOption((options) => options.setName("players").setDescription("how many players are playing").setRequired(true).setMinValue(1).setMaxValue(10)) //implicitly known from the # of non-null "players" specified in args
  .addIntegerOption((options) => options.setName("seekers").setDescription("how many seekers are there").setRequired(true).setMinValue(1).setMaxValue(4))
  .addUserOption((options) => options.setName("person").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person2").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person3").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person4").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person5").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person6").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person7").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person8").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person9").setDescription("temp").setRequired(false))
  .addUserOption((options) => options.setName("person10").setDescription("temp").setRequired(false)))
  .addSubcommand((subcommand) => subcommand.setName("kingdom").setDescription("The Spinwheel for the kingdom")
  .addStringOption((options) => options.setName("banned").setDescription("Allows the bot to choose banned kingdoms").addChoices({ name: 'Yes', value: 'yes' }, { name: 'No', value: 'no' }).setRequired(true))),
     /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
  async execute(interaction, client) {
    const applyText = (canvas, text) => {
        const context = canvas.getContext('2d');
        let fontSize = 70;
    
        do {
            context.font = `${fontSize -= 10}px sans-serif`;
        } while (context.measureText(text).width > canvas.width - 300);
    
        return context.font;
    };
    const kingdomcolour = (messageembed, number) => {
        let colours = ["#B73439", "#6D6660", "#74D379", "#E4804F", "#8E94B6", "#3A604B", "#3A604B", "#DABFF6", "#80335D", "#3F4754", "#7696BD", "#719CAD", "#F980AB", "#35313F", "#596541", "#D5D7D6", "#342635", "#35334B"]
        let crandom = Math.floor((number == colours.length))
        let cresult = colours[crandom];

        messageembed.setColor(cresult)
    }
    const embedmaker = (res, footer, attachment, imagename) => {
        let embed = new EmbedBuilder()
        embed.setImage(`attachment://${imagename}`)
        //embed.setDescription(`${des}`)
        embed.setColor("Random")
        embed.setFooter({ text: `${footer}`, iconURL: client.user.displayAvatarURL({format: 'png', size: 512 }) })
        interaction.reply({ content: `The Seeker(s) are ${res}`, embeds: [embed], files: [attachment] })
    }
    switch (interaction.options.getSubcommand()) {
        case "seeker":
            let people = [interaction.options.getUser("person"), interaction.options.getUser("person2"), interaction.options.getUser("person3"), interaction.options.getUser("person4"), interaction.options.getUser("person5"), interaction.options.getUser("person6"), interaction.options.getUser("person7"), interaction.options.getUser("person8"), interaction.options.getUser("person9"), interaction.options.getUser("person10")]
            
            let results = [];
            results = people.filter((x, i, s) => {
                return s.indexOf(x) === i && x != null;
            });
            // console.log("max" + max);
            let il = Math.min(interaction.options.getInteger("seekers"), results.length);

            while (results.length > il) {
                let prand = Math.floor(Math.random() * results.length);
                results.splice(prand, 1);
            }
            
            if (results.length > 0) {
                if (results.length <= 4) {
                    // canvas for 1,2,3 or 4
                    const canvas = createCanvas(1000, 500);
                    const context = canvas.getContext('2d');
                    const images = ["Wooded", "Deep Woods", "Ruined", "Lost", "Darker Side"]
                    const irandom = Math.floor((Math.random() * images.length));
                    const iresult = images[irandom];
                    const background = await readFile(`./Images/Screenshots/Unedited/${iresult}.jpg`);
                    const backgroundImage = new Image()
                    backgroundImage.src = background
                    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                    context.textBaseline = 'top';
                    context.textAlign = 'left';

                    
                    for (let i = 0; i < results.length; i++) {
                        const { body } = await request(results[i].displayAvatarURL({ format: 'jpg', size: 256 }));
                        const avatar = new Image()
                        avatar.src = Buffer.from(await body.arrayBuffer())

                        // circular images
                        context.beginPath();
                        context.arc(100, 75 + (i * 115), 50, 0, Math.PI * 2, true);
                        context.closePath();
                        context.save();
                        context.clip();
                        context.drawImage(avatar, 50, 25 + (i * 115), 100, 100);
                        context.restore();
                        
                        context.font = '24px sans-serif';
                        context.font = applyText(canvas, `${results[i].username}`);
                        context.fillStyle = '#FFFFFF';
                        context.fillText(`${results[i].username}`, 200, 25 + (i * 115));
                    }

                    let sattachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'seeker.png' });
                    let res = "";
                    results.forEach(u => {
                        res += ("<@" + u.id + "> ");
                    });

                    embedmaker(res, "Seeker Wheel", sattachment, "seeker.png")
                }
                else {
                    let res = "";
                    results.forEach(u => {
                        res += ("<@" + u.id + "> ");
                    });
                    interaction.reply({ content: `${res}`})
                }
            }
        break

        case "kingdom":
            let banned = interaction.options.getString("banned")
            let kingdoms = []

            if(banned === "yes") {
                kingdoms = ["Mushroom", "Cap", "Cascade", "Sand", "Lake", "Wooded", "Deep Woods", "Cloud", "Lost", "Metro", "Snow", "Seaside", "Luncheon", "Ruined", "Bowser's", "Moon", "Dark Side", "Darker Side"]
            } else if(banned === "no") {
                kingdoms = ["Mushroom", "Cap", "Cascade", "Sand", "Lake", "Wooded", "Lost", "Metro", "Snow", "Seaside", "Luncheon", "Ruined", "Bowser's", "Moon"]
            }

            let random = Math.floor((Math.random() * kingdoms.length));
            const result = kingdoms[random];
            
            const image = await readFile(`./Images/Screenshots/Edited/JPEG/${result}.jpg`);
            let attachment = new AttachmentBuilder(image);
            for (let i = 0; i < kingdoms.length; i++) {
                if ((kingdoms[i] != "Deep Woods" && kingdoms[i] != "Dark Side" && kingdoms[i] != "Darker Side") || (Math.floor(Math.random() * 100) == 69)) {
                    kingdoms[i] += " Kingdom";
                }
            }
            let embed = new EmbedBuilder()
            embed.setImage(`attachment://file.jpg`)
            embed.setFooter({ text: `The Kingdom is: ${kingdoms[random]}`, iconURL: client.user.displayAvatarURL({format: 'png', size: 512 }) })
            kingdomcolour(embed, random)

            interaction.reply({ embeds: [embed], files: [attachment] })
        break
    }
  }
}
