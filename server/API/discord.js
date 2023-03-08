const { Client, Events, GatewayIntentBits } = require('discord.js');
const db = require("./db");
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT);

// client.users.send('231812615842693120', 'Hello world');

const message = ["", "Hey, OMG new tweet from this user ", "Hey, OMG new tweet from this topic "]

const sendDiscordMessage = (user_id, action_id, action) => {
    console.log("user_id: " + user_id);
    console.log("action_id: " + action_id);
    console.log("action: " + action);
    db.selectDB("user_credentials", "user_id", user_id, function(credentials) {
        if (credentials === "KO") {
            return "KO";
        } else {
            for (let i = 0; i < credentials.length; i++) {
                if (credentials[i].oauth2_id === 4) {
                    const token = JSON.parse(credentials[i].token);
                    console.log("token: " + token);
                    const discord_id = token.discord_id;
                    client.users.send(discord_id, message[action_id] + action);
                }
            }
        }
    });
}

module.exports = { sendDiscordMessage };