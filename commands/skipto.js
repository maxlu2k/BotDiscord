const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder().setName("skipto").setDescription("Skip bài hát tới: ?")
        .addNumberOption((option) =>
            option.setName("tracknumber").setDescription("Bài hát được skip tới").setMinValue(1).setRequired(true)),
    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue)
        {
            await interaction.reply("Không có bài hát nào đang được phát");
            return;
        }

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Số bài không hợp lệ")

        // Skip the current song to trackNum
        queue.skipTo(trackNum)
        //Thumbnail
        const queueThumbnail = queue.tracks.map((song) => {
            return `${song.thumbnail}`
        }).join("\n")

        //title
        const queueTitle = queue.tracks.map((song) => {
            return `${song.title}`
        }).join("\n")

        //url
        const queueUrl = queue.tracks.map((song, i) => {
            return `${song.url} - ${song[i]}`
        }).join("\n")

        const queueString = queue.tracks.map((song) => {
            return `[${song.duration}]\` ${song.title}\` - <@${song.requestedBy.id}>`
        }).join("\n")

        console.log(`-------1--------\n${queueString}`)
        console.log(`-------2--------\n${queueThumbnail}`)
        // const currentSong = queue.current(trac)
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xff6700)
                    .setTitle(`${queueTitle}`)
                    .setURL(`${queueUrl}`)
                    .setDescription(`Đã được skip tới bài số ${trackNum}\n**${queueString}** đang được phát`)
                    .setThumbnail(`${queueThumbnail}`)
            ]
        })
    },
}
