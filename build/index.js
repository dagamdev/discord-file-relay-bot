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
        if (typeof categoryId === 'string') {
            const guild = FileRelayBot.guilds.cache.get(GUILD_ID);
            const destinationChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.find(c => c.parentId === categoryId && c.name === channel.name);
            if (destinationChannel === undefined) {
                guild === null || guild === void 0 ? void 0 : guild.channels.create(channel.name, { nsfw: true, parent: categoryId, type: 'GUILD_TEXT' }).then((ch) => {
                    ch.send({ content: msg.attachments.size > 0 ? content.concat(`\n\n${msg.attachments.map(at => at.url).map((url, i) => `[File ${i + 1}](${url})`).join(', ')}`) : content });
                });
            }
            else if (destinationChannel.type === 'GUILD_TEXT') {
                destinationChannel.send({ content: msg.attachments.size > 0 ? content.concat(`\n\n${msg.attachments.map(at => at.url).map((url, i) => `[File ${i + 1}](${url})`).join(', ')}`) : content });
            }
        }
    }
});
FileRelayBot.login(config_1.TOKEN);
