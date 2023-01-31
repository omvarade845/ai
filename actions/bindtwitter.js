const { twitter } = require('../libs');
const { bot, database, Router, Composer } = require('../core/index');
const users = database('users');
const botdb = database('bot');
const composer = new Composer();
const { steps } = require('../generators.js/index');
const { check_twitter } = twitter;
const router = new Router((ctx) => ctx.session.step);

composer.callbackQuery('bindtwitter', async (ctx, next) => {
  const user = await users.findOne({ id: ctx.from.id });
  const { is_verified, user_step } = user;
  if (user_step == 'bind twitter') {
    ctx.editMessageText(
      `Welcome To <b>Coin Face($CFT)</b> Airdrop Bot, I will be your personal Companion For this Airdrop\n\n` +
        `<b>Now Send Me Your Twitter Account With @</b>`,
      { parse_mode: 'HTML' },
    );
  } else {
    await steps(ctx);
  }
  await next();
  ctx.session.step = 'bindtwitter';
});

router.route('bindtwitter', async (ctx) => {
  const msg = ctx.msg?.text ?? '';
  // ctx.deleteMessage();
  ctx.reply(`<b>🔎 Searching Twitter For</b> ${msg}, please be patient`, {
    parse_mode: 'HTML',
  });
  console.log(msg);
  if (msg.charAt(0) == '@') {
    let twitter = msg.substring(1);
    let isValidTwitter = await check_twitter(twitter);
    if (!isValidTwitter.errors && isValidTwitter.data) {
      // console.log(twitter);
      let isValid = await users.findOne({ twitter_id: isValidTwitter.data.id });
      if (isValid) {
        ctx.reply(
          `⛔ <b>Error:</b> @${twitter} <i>is already in the database, please try again</i>`,
          { parse_mode: 'HTML' },
        );
      } else {
        // console.log(isValidTwitter);

        await users.updateOne(
          {
            id: ctx.from.id,
          },
          {
            $set: {
              twitter: twitter,
              twitter_id: isValidTwitter.data.id,
              user_step: 'telegram task',
              bind_twitter: true,
            },
          },
        );
        ctx.session.step = 'idle';
        ctx.session.bind_twitter = twitter;
        await ctx.reply(
          `✅ <b>Twitter Account Added</b>\n\nTwitter Account <a href="https://twitter.com/${twitter}">${twitter}</a> have been binded to your account`,
          {
            parse_mode: 'HTML',
          },
        );
        await steps(ctx);
      }
    } else if (isValidTwitter.error) {
      await ctx.reply('Too much request, try again later');
    } else if (isValidTwitter.errors) {
      ctx.reply(
        `⛔ <b>Error:</b>\n@${twitter} <i>is not a valid twitter account, please try again or</i> <a href="https://twitter.com/signup">sign up</a>`,
        {
          parse_mode: 'HTML',
        },
      );
    }
  } else {
    ctx.reply(
      `⛔ <b>Error:</b> <i>Invalid Twitter Account, Please Send Your Twitter account With @</i>`,
      { parse_mode: 'HTML' },
    );
  }
});

bot.use(router);
bot.use(composer);
