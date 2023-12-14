"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const config_1 = require("./lib/config");
const data_1 = require("./lib/data");
const GUILD_ID = '949861760096145438';
const FileRelayBot = new discord_js_selfbot_v13_1.Client({
    checkUpdate: false
});
FileRelayBot.on('ready', () => {
    var _a;
    console.log(`I'm ready ${(_a = FileRelayBot.user) === null || _a === void 0 ? void 0 : _a.username}`);
});
FileRelayBot.on('messageCreate', (msg) => {
    const { channel, content } = msg;
    if (channel.type === 'GUILD_TEXT') {
        const { parentId } = channel;
        if (parentId === null)
            return;
        const categoryId = data_1.CATEGORY_IDS[parentId];
        if (categoryId !== undefined) {
            const guild = FileRelayBot.guilds.cache.get(GUILD_ID);
            const destinationChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.find(c => c.parentId === categoryId && c.name === channel.name);
            const handleFiles = (channel) => {
                const messages = [];
                let message = '';
                let count = 0;
                let i = 0;
                msg.attachments.forEach((at) => {
                    const file = `[File ${i + 1}](${at.url})`;
                    const previewMessage = (message.length > 0 ? message + ', ' : '') + file;
                    if (count < 5 && previewMessage.length < 2000) {
                        message = previewMessage;
                        count++;
                        if (i + 1 === file.length) {
                            messages.push(message);
                        }
                    }
                    else {
                        messages.push(message);
                        message = file;
                        count = 0;
                    }
                    i++;
                });
                if (content.length > 0)
                    channel.send({ content });
                messages.forEach(m => {
                    setTimeout(() => {
                        channel.send({ content: m });
                    }, 2000);
                });
            };
            if (destinationChannel === undefined) {
                guild === null || guild === void 0 ? void 0 : guild.channels.create(channel.name, { nsfw: true, parent: categoryId, type: 'GUILD_TEXT' }).then((ch) => {
                    handleFiles(ch);
                });
            }
            else if (destinationChannel.type === 'GUILD_TEXT') {
                handleFiles(destinationChannel);
            }
        }
    }
});
FileRelayBot.login(config_1.TOKEN);
