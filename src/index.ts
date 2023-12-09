import { Client, type TextChannel } from 'discord.js-selfbot-v13'
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

    if (categoryId !== undefined) {
      const guild = FileRelayBot.guilds.cache.get(GUILD_ID)
      const destinationChannel = guild?.channels.cache.find(c => c.parentId === categoryId && c.name === channel.name)

      const handleFiles = (channel: TextChannel) => {
        const messages: string[] = []
        let message = ''
        let count = 0
        let i = 0

        msg.attachments.forEach((at) => {
          const file = `[File ${i + 1}](${at.url})`
          const previewMessage = (message.length > 0 ? message + ', ' : '') + file

          if (count < 5 && previewMessage.length < 2000) {
            message = previewMessage
            count++
            if (i + 1 === file.length) {
              messages.push(message)
            }
          } else {
            messages.push(message)
            message = file
            count = 0
          }
          i++
        })

        channel.send({ content })
        messages.forEach(m => {
          setTimeout(() => {
            channel.send({ content: m })
          }, 2000)
        })
      }

      if (destinationChannel === undefined) {
        guild?.channels.create(channel.name, { nsfw: true, parent: categoryId, type: 'GUILD_TEXT' }).then((ch) => {
          handleFiles(ch)
        })
      } else if (destinationChannel.type === 'GUILD_TEXT') {
        handleFiles(destinationChannel)
      }
    }
  }
})

FileRelayBot.login(TOKEN)
