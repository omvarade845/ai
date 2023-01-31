const Twitter = require('twitter-lite');
const { database } = require('../core');
const { bot_token, admin, tweet_id } = require('../core/config');
const botdata = database('bot');

const client = new Twitter({
  version: '2', // version "1.1" is the default (change for v2)
  extension: false,
  consumer_key: 'pz2FYD7Mnll7Zb1ypL0AyvY3w',
  consumer_secret: 'VGS9PryGdINglG3Zfvv6yk34oLttspblFETeHIlpTyV3GhmAk4',
  access_token_key: '1412059120140759044-FunVz27IBAtaOSEUnPxcR9FSoPKXlX',
  access_token_secret: '0CBA9Bfs1quhUavwMtGTwf0m6icSaylsYjLwUHQDGq91Z',
});
const createInstance = async (target) => {
  let { post_limited, post_limited_for, user_lookup, user_lookup_limit } =
    await botdata.findOne({ id: bot_token });
  var delta, time_remaining, limited;

  if (target == 'user_lookup') {
    limited = user_lookup;
    delta = user_lookup_limit * 1000 - Date.now();
    time_remaining = Math.floor(delta / 1000 / 60);
    if (time_remaining <= 0) {
      await botdata.updateOne(
        { id: bot_token },
        { $set: { user_lookup: false, user_lookup_limit: 0 } },
      );
    }
  } else {
    limited = post_limited;
    delta = post_limited_for * 1000 - Date.now();
    time_remaining = Math.floor(delta / 1000 / 60);
    if (time_remaining <= 0) {
      await botdata.updateOne(
        { id: bot_token },
        { $set: { post_limited: false, post_limited_for: 0 } },
      );
    }
  }

  if (limited) {
    return false;
  } else {
    return client;
  }
};

const check_twitter = async (username) => {
  let instance = await createInstance('user_lookup');
  if (instance) {
    try {
      const data = await instance.get('users/by/username/' + username);
      var rate_limit = data._headers.get('x-rate-limit-remaining');
      var rate_limit_reset = data._headers.get('x-rate-limit-reset');
      if (rate_limit <= 2) {
        await botdata.updateOne(
          { id: bot_token },
          { $set: { user_lookup: true, user_lookup_limit: rate_limit_reset } },
        );
      }
      return data;
    } catch (error) {
      console.log(error);
      return { errors: true };
    }
  } else {
    return { error: true };
  }
};

const check_tasks = async (id) => {
  let instance = await createInstance('get_post');

  if (instance) {
    try {
      /*let retweeted = false;
      let liked = false;
      const info = await instance.get('tweets/' + tweet_id + '/retweeted_by');
      var rate_limit = info._headers.get('x-rate-limit-remaining');
      var rate_limit_reset = info._headers.get('x-rate-limit-reset');
      if (rate_limit <= 2) {
        await botdata.updateOne(
          { id: bot_token },
          { $set: { post_limited: true, post_limited_for: rate_limit_reset } },
        );
      }

      let { data } = info;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
          retweeted = true;
          break;
        }
      }

      if (!retweeted) {
        return { status: false, message: '⛔ You have not retweeted post' };
      }*/

      let info2 = await instance.get('users/' + id + '/liked_tweets');
      var rate_limit2 = info2._headers.get('x-rate-limit-remaining');
      var rate_limit_reset2 = info2._headers.get('x-rate-limit-reset');
      if (rate_limit2 <= 2) {
        await botdata.updateOne(
          { id: bot_token },
          { $set: { post_limited: true, post_limited_for: rate_limit_reset2 } },
        );
      }
      let data2 = info2.data;
      for (let i = 0; i < data2.length; i++) {
        if (data2[i].id == tweet_id) {
          var liked = true;
          break;
        }
      }
      if (!liked) {
        return { status: false, message: '⛔ You have not liked the post' };
      }

      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false, message: '⛔ Please Try Again Later' };
    }
  } else {
     let { post_limited, post_limited_for, user_lookup, user_lookup_limit } =
    await botdata.findOne({ id: bot_token });
    var delta = post_limited_for * 1000 - Date.now();
    var time_remaining = Math.floor(delta / 1000 / 60);
    return { status: false, message: 'Too many requests, try after '+time_remaining+' minutes' };
  }
};

module.exports = {
  check_tasks,
  check_twitter,
};
