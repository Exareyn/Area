const needle = require('needle');
const {google} = require('googleapis');
require('dotenv').config();
const db = require('./db');

const calendar_ID = process.env.GOOGLE_CALENDAR_ID;
const calendar_email = process.env.GOOGLE_CLIENT_EMAIL;

const message = ["", "OMG nouvo tweet de ", "OMG nouvo tweet sur le topic "];


const ahahtoken = (data, loaded_data) => {
    db.selectDB("user_credential", "user_id", `'${data.user_id}'`, function (result) {
        for (let i = 0; i < result.length; i++) {
            if (result.oauth2_id === 1)
                var token = JSON.parse(result[i].token);
        }
        let currentDate = new Date();
        const event = {
            'summary': `${message[data.action_id]}` + `${loaded_data.action}`,
            'location': '',
            'description': 'nouvo tweet',
            'start': {
              'dateTime': currentDate.getDate().toString(),
              'timeZone': 'France/Paris',
            },
            'end': {
              'dateTime': (currentDate.getDate()+60).toString(),
              'timeZone': 'France/Paris',
            },
            'attendees': [],
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
              ],
            },
        };
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.insert({
            // auth: token.token,
            calendarId: 'primary',
            resource: event,
        }, function(err, event) {
            if (err) {
              console.log('There was an error contacting the Calendar service: ' + err);
              return;
            }
            console.log('Event created: %s', event.htmlLink);
          });

    })}

module.exports = {ahahtoken};