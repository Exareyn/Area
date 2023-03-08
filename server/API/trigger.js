const { discordSort } = require("discord.js");
const db = require("./db");
const twitter = require("./twitter");
const discord = require("./discord");
const facebook = require("./facebook");
const calendar = require("./calendar");


const triggerReaction = (data, modif, loaded_data) => {
    if (data.reaction_id === 1 && modif === true) {
        console.log("Reaction 1");
        console.log("SEND MAIL OMG");
    } else if (data.reaction_id === 2 && modif === true) {
        console.log("Reaction 2");
        twitter.reactionSendTweet(data);
    } else if (data.reaction_id === 3 && modif === true) {
        console.log("Reaction 3");
        discord.sendDiscordMessage(data.user_id, data.action_id, loaded_data.action);
    } else if (data.reaction_id === 4 && modif === true) {
        console.log("Reaction 4");
        twitter.reactionRetweet(data, loaded_data.last_tweet);
    } else if (data.reaction_id === 5 && modif === true) {
        console.log("Reaction 5");
        facebook.reactionSendPost()
    } else if (data.reaction_id === 6 && modif === true) {
        console.log('Reaction 6');
        calendar.ahahtoken(data, loaded_data);
    }
}

const triggerTweetofUser = () => {
    db.selectDB("area", "action_id", "1", function(data) {
        if (data === "KO") {
            console.log("ERROR: triggerTweetofUser NOTHING TO DO");
            return "KO";
        }
        for (let i = 0; i < data.length; i++) {
            var modif = false;
            const loaded_data = JSON.parse(data[i].loaded_data);
            twitter.getTweetofUser(loaded_data.action, function(tweet) {
                if (tweet !== "KO") {
                    if (tweet.meta.newest_id !== loaded_data.last_tweet || loaded_data.last_tweet === undefined) {
                        var newLoadedData = {
                            "action": loaded_data.action,
                            "last_tweet": tweet.meta.newest_id,
                            "reaction": loaded_data.reaction
                        }
                        db.updateDB("area", "loaded_data", JSON.stringify(newLoadedData), "id", data[i].id, function(result) {
                            if (result === "KO") {
                                return "KO";
                            }
                            modif = true;
                            triggerReaction(data[i], modif, newLoadedData);
                        });
                    }
                }
            });
        }
    });
}

const triggerTweetofTrend = () => {
    db.selectDB("area", "action_id", "2", function(data) {
        if (data === "KO") {
            console.log("ERROR: triggerTweetofTrend NOTHING TO DO");
            return "KO";
        }
        for (let i = 0; i < data.length; i++) {
            var modif = false;
            const loaded_data = JSON.parse(data[i].loaded_data);
            twitter.getTweetofTrend(loaded_data.action, function(tweet) {
                if (tweet !== "KO") {
                    if (tweet.meta.newest_id !== loaded_data.last_tweet || loaded_data.last_tweet === undefined) {
                        var newLoadedData = {
                            "action": loaded_data.action,
                            "last_tweet": tweet.meta.newest_id,
                            "reaction": loaded_data.reaction
                        }
                        db.updateDB("area", "loaded_data", JSON.stringify(newLoadedData), "id", data[i].id, function(result) {
                            if (result === "KO") {
                                return "KO";
                            }
                            modif = true;
                            triggerReaction(data[i], modif, newLoadedData);
                        });
                    }
                }
            });
        }
    });
}

module.exports = { triggerTweetofUser, triggerTweetofTrend };