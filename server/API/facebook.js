const FB = require("fb");
require('dotenv').config();

FB.setAccessToken(process.env.FACEBOOK_BEARER_TOKEN);

////////// ACTIONS //////////

const getUserInfo = async () => {
  FB.api('/me', function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log(res);
  });
}

////////// REACTIONS //////////

const reactionSendPost = async () => {

  var body = "This post was made with Area, available on web browser and android.\n(you can\'t find it because it's just a project lol)";
  FB.api('me/feed', 'post', { message: body }, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
  });
}

module.exports = { getUserInfo, reactionSendPost };