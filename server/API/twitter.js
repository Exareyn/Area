const needle = require('needle');
const Twitter = require('twitter');
require('dotenv').config();
const db = require('./db');

const token = process.env.TWITTER_BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

const tweetReaction = ["", "Hey, OMG new tweet from this user ", "Hey, OMG new tweet from this topic "];

// ACTION

const getTweetofUser = async (name, callback) => {
    const params = {
        'query': `from:${name}`,
        'tweet.fields': 'created_at'
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return callback(res.body);
    } else {
        return callback("KO");
    }
}

const getTweetofTrend = async (trend, callback) => {
    const params = {
        'query': `${trend}`,
        'tweet.fields': 'created_at'
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return callback(res.body);
    } else {
        return callback("KO");
    }
}

// REACTION

const reactionSendTweet = (data) => {
    const loaded_data = JSON.parse(data.loaded_data);
    const tweet = tweetReaction[data.reaction_id] + loaded_data.action;
    db.selectDB("user_credentials", "user_id", data.user_id, function(result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].oauth2_id === 2) {
                const token = JSON.parse(result[i].token);
                const client = new Twitter({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: token.token,
                    access_token_secret: token.tokenSecret
                });
                client.post('statuses/update', {status: tweet}, function(error, tweet, response) {
                    if (!error) {
                        console.log(tweet);
                        console.log(response);
                    } else {
                        console.log(error);
                    }
                })
            }
        }
    })
}

const reactionRetweet = (data, tweetID) => {
    const loaded_data = JSON.parse(data.loaded_data);
    db.selectDB("user_credentials", "user_id", data.user_id, function(result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].oauth2_id === 2) {
                const token = JSON.parse(result[i].token);
                const client = new Twitter({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: token.token,
                    access_token_secret: token.tokenSecret
                });
                client.post('statuses/retweet/' + tweetID, function(error, tweet, response) {
                    if (!error) {
                        console.log(tweet);
                        console.log(response);
                    } else {
                        console.log(error);
                    }
                })
            }
        }
    });
}

module.exports = { getTweetofUser, getTweetofTrend, reactionSendTweet, reactionRetweet };