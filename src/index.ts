import { Client } from 'discord.js-selfbot-v13'
import { TOKEN } from './lib/config'
import { CATEGORY_IDS } from './lib/data'

const GUILD_ID = '949861760096145438'

const FileRelayBot = new Client({
  checkUpdate: false
})

FileRelayBot.on('ready', () => {
  console.log(`I'm ready ${FileRelayBot.user?.username}`)
})

FileRelayBot.on('messageCreate', (msg) => {
  const { channel, content } = msg

  if (channel.type === 'GUILD_TEXT') {
    const { parentId } = channel

    if (parentId === null) return

    const categoryId = CATEGORY_IDS[parentId]

    if (typeof categoryId === 'string') {
      const guild = FileRelayBot.guilds.cache.get(GUILD_ID); const destinationChannel = guild?.channels.cache.find(c => c.parentId === categoryId && c.name === channel.name)

      if (destinationChannel === undefined) {
        guild?.channels.create(channel.name, { nsfw: true, parent: categoryId, type: 'GUILD_TEXT' }).then((ch) => {
          ch.send({ content: msg.attachments.size > 0 ? content.concat(`\n\n${msg.attachments.map(at => at.url).map((url, i) => `[File ${i + 1}](${url})`).join(', ')}`) : content })
        })
      } else if (destinationChannel.type === 'GUILD_TEXT') {
        destinationChannel.send({ content: msg.attachments.size > 0 ? content.concat(`\n\n${msg.attachments.map(at => at.url).map((url, i) => `[File ${i + 1}](${url})`).join(', ')}`) : content })
      }
    }
  }
})

FileRelayBot.login(TOKEN)
