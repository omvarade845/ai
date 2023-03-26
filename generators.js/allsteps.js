const { database } = require('../core');
const { tweet_id } = require('../core/config');
const botdb = database('bot');
const users = database('users');
const { InlineKeyboard, Keyboard } = require('../core/index');
const steps = async (ctx) => {
  const user = await users.findOne({ id: ctx.from.id });
  const { is_verified, user_step } = user;
  if (is_verified) {
    await main_menu(ctx);
    return 'user is verified';
  } else {
    switch (user_step) {
      case 'bind twitter':
        await bind_twitter(ctx);
        break;
      case 'telegram task':
        await telegram_task(ctx);
        break;
      case 'twitter task':
        await twitter_task(ctx);
        break;
      case 'youtube task':
        await youtube_task(ctx);
        break;
      case 'bind_wallet':
        await bind_wallet(ctx);
        break;
      case 'Done':
        await main_menu(ctx);
        break;

      default:
        await ctx.reply('database corrupted');
        break;
    }
  }
};

const bind_twitter = async (ctx) => {
  await users.updateOne(
    { id: ctx.from.id },
    { $set: { user_step: 'bind twitter' } },
  );
  await ctx.reply(
    `Welcome To <b>MetaCateAI</b> Airdrop Bot, I will your personal Companion For this Airdrop\n\n` +
      `<b>Before You Proceed You will need to Bind Your Twitter Account TO Contiune tasks</b>`,
    {
      reply_markup: new InlineKeyboard().text('Bind Twitter', 'bindtwitter'),
      parse_mode: 'HTML',
    },
  );
};

const telegram_task = async (ctx) => {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '✅';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
    `📚 <i><b>❇️WE are glad that you joined our airdrop</b>\n\n🔘<b>Total Reward </b>: 2100 BUSD \n<b>🔘Winners</b>: 1 st\n<b>🔘 Top Refer</b> :1 price 1k $\n2 price 500$\n3 price 300$\n4 price  150$ \n5 price 100$ \nRandom 100 10$ \n</i>\n\n<b>Here's a fact for #MetaCateAI: accepting $METACATEAI will benefit your business 👍</b>\n\n<b>And all each user gert our random token</b>\n\n

 ` +
    `🌐 <b>Website:</b> https://metacateai.live/\n\n` +
    `<b>🌧 Our Airdrop Tasks , You Must Complete</b>\n` +
    `1. <i><b>🔘 Bind Twitter Account</b></i> ${done_bind}\n` +
    `2. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAichannel">Telegram Channel</a> ${done_telegram}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAigroup">Group Chat</a> ${done_group}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "http://twitter.com/metacateai_live">Twitter</a> ${done_twitter}\n` +
    `5. <i><b>🔘Retweet And Like This</b> </i> <a href = "http://twitter.com/metacateai_live">tweet</a> ${done_twitter}\n` +
    `6. <i><b>🔘Subscribe Our</b></i> <a href = "https://youtube.com/@MetaCateAI">YouTube</a> <i>Channel</i> ${done_youtube}\n` +
    `7. <i><b>🔘Bind Bep-20 wallet for distribution</b></i> ${bind_wallet}\n` +
    `8. <i><b>🔘Get 1 point for each successful refferal</b></i>\n\n` +
    `<b>⛔ Note:</b>\nYou must Complete all tasks to qualify for distribution or you wont get any token doing distribution`;
  ctx.reply(text, {
    reply_markup: new InlineKeyboard().text('Start Tasks', 'letstart'),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
};

const twitter_task = async (ctx) => {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '✅';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
    `📚 <i><b>❇️WE are glad that you joined our airdrop</b>\n\n🔘<b>Total Reward </b>: 2100 BUSD \n<b>🔘Winners</b>: 1 st\n<b>🔘 Top Refer</b> :1 price 1k $\n2 price 500$\n3 price 300$\n4 price  150$ \n5 price 100$ \nRandom 100 10$ \n</i>\n\n<b>Here's a fact for #MetaCateAI: accepting $METACATEAI will benefit your business 👍</b>\n\n<b>And all each user gert our random token</b>\n\n
 ` +
     `🌐 <b>Website:</b> https://metacateai.live/\n\n` +
    `<b>🌧 Our Airdrop Tasks , You Must Complete</b>\n` +
    `1. <i><b>🔘 Bind Twitter Account</b></i> ${done_bind}\n` +
    `2. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAichannel">Telegram Channel</a> ${done_telegram}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAigroup">Group Chat</a> ${done_group}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "http://twitter.com/metacateai_live">Twitter</a> ${done_twitter}\n` +
    `5. <i><b>🔘Retweet And Like This</b> </i> <a href = "http://twitter.com/metacateai_live">tweet</a> ${done_twitter}\n` +
    `6. <i><b>🔘Subscribe Our</b></i> <a href = "https://youtube.com/@MetaCateAI">YouTube</a> <i>Channel</i> ${done_youtube}\n` +
    `7. <i><b>🔘Bind Bep-20 wallet for distribution</b></i> ${bind_wallet}\n` +
    `8. <i><b>🔘Get 1 point for each successful refferal</b></i>\n\n`;

  ctx.reply(text, {
    reply_markup: new InlineKeyboard()
      .url(
        'Follow,Like,Retweet',
        'http://twitter.com/metacateai_live/status/' + tweet_id,
      )
      .row()
      .text('Continue', 'letmove'),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
};

const youtube_task = async (ctx) => {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '✅';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
    `📚 <i><b>❇️WE are glad that you joined our airdrop</b>\n\n🔘<b>Total Reward </b>: 2100 BUSD \n<b>🔘Winners</b>: 1 st\n<b>🔘 Top Refer</b> :1 price 1k $\n2 price 500$\n3 price 300$\n4 price  150$ \n5 price 100$ \nRandom 100 10$ \n</i>\n\n<b>Here's a fact for #MetaCateAI: accepting $METACATEAI will benefit your business 👍</b>\n\n<b>And all each user gert our random token</b>\n\n
 ` +
     `🌐 <b>Website:</b> https://metacateai.live/\n\n` +
    `<b>🌧 Our Airdrop Tasks , You Must Complete</b>\n` +
    `1. <i><b>🔘 Bind Twitter Account</b></i> ${done_bind}\n` +
    `2. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAichannel">Telegram Channel</a> ${done_telegram}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAigroup">Group Chat</a> ${done_group}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "http://twitter.com/metacateai_live">Twitter</a> ${done_twitter}\n` +
    `5. <i><b>🔘Retweet And Like This</b> </i> <a href = "http://twitter.com/metacateai_live">tweet</a> ${done_twitter}\n` +
    `6. <i><b>🔘Subscribe Our</b></i> <a href = "https://youtube.com/@MetaCateAI">YouTube</a> <i>Channel</i> ${done_youtube}\n` +
    `7. <i><b>🔘Bind Bep-20 wallet for distribution</b></i> ${bind_wallet}\n` +
    `8. <i><b>🔘Get 1 point for each successful refferal</b></i>\n\n`;

  ctx.reply(text, {
    reply_markup: new InlineKeyboard()
      .url(
        'Subscribe Now',
        'https://www.youtube.com/@CoinFace2023',
      )
      .row()
      .text('Continue', 'letsgo'),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
};

async function bind_wallet(ctx) {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '❌';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
    `📚 <i><b>❇️WE are glad that you joined our airdrop</b>\n\n🔘<b>Total Reward </b>: 2100 BUSD \n<b>🔘Winners</b>: 1 st\n<b>🔘 Top Refer</b> :1 price 1k $\n2 price 500$\n3 price 300$\n4 price  150$ \n5 price 100$ \nRandom 100 10$ \n</i>\n\n<b>Here's a fact for #MetaCateAI: accepting $METACATEAI will benefit your business 👍</b>\n\n<b>And all each user gert our random token</b>\n\n
 ` +
     `🌐 <b>Website:</b> https://metacateai.live/\n\n` +
    `<b>🌧 Our Airdrop Tasks , You Must Complete</b>\n` +
    `1. <i><b>🔘 Bind Twitter Account</b></i> ${done_bind}\n` +
    `2. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAichannel">Telegram Channel</a> ${done_telegram}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAigroup">Group Chat</a> ${done_group}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "http://twitter.com/metacateai_live">Twitter</a> ${done_twitter}\n` +
    `5. <i><b>🔘Retweet And Like This</b> </i> <a href = "http://twitter.com/metacateai_live">tweet</a> ${done_twitter}\n` +
    `6. <i><b>🔘Subscribe Our</b></i> <a href = "https://youtube.com/@MetaCateAI">YouTube</a> <i>Channel</i> ${done_youtube}\n` +
    `7. <i><b>🔘Bind Bep-20 wallet for distribution</b></i> ${bind_wallet}\n` +
    `8. <i><b>🔘Get 1 point for each successful refferal</b></i>\n\n`;

  await ctx.reply(text, {
    reply_markup: new InlineKeyboard().text('Bind Wallet', 'setwallet'),
    parse_mode: 'html',
    disable_web_page_preview: true,
  });
}

async function main_menu(ctx) {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '✅';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
     `📚 <i><b>❇️WE are glad that you joined our airdrop</b>\n\n🔘<b>Total Reward </b>: 2100 BUSD \n<b>🔘Winners</b>: 1 st\n<b>🔘 Top Refer</b> :1 price 1k $\n2 price 500$\n3 price 300$\n4 price  150$ \n5 price 100$ \nRandom 100 10$ \n</i>\n\n<b>Here's a fact for #MetaCateAI: accepting $METACATEAI will benefit your business 👍</b>\n\n<b>And all each user gert our random token</b>\n\n
 ` +
     `🌐 <b>Website:</b> https://metacateai.live/\n\n` +
    `<b>🌧 Our Airdrop Tasks , You Must Complete</b>\n` +
    `1. <i><b>🔘 Bind Twitter Account</b></i> ${done_bind}\n` +
    `2. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAichannel">Telegram Channel</a> ${done_telegram}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "https://t.me/MetaCateAigroup">Group Chat</a> ${done_group}\n` +
    `3. <i><b>🔘 Join our </b></i> <a href = "http://twitter.com/metacateai_live">Twitter</a> ${done_twitter}\n` +
    `5. <i><b>🔘Retweet And Like This</b> </i> <a href = "http://twitter.com/metacateai_live">tweet</a> ${done_twitter}\n` +
    `6. <i><b>🔘Subscribe Our</b></i> <a href = "https://youtube.com/@MetaCateAI">YouTube</a> <i>Channel</i> ${done_youtube}\n` +
    `7. <i><b>🔘Bind Bep-20 wallet for distribution</b></i> ${bind_wallet}\n` +
    `8. <i><b>🔘Get 1 point for each successful refferal</b></i>\n\n` +
    `✅ <b>Congratulations You have been registered for the airdrop</b>`;

  const keyboard = new Keyboard()
    .text('📚 Account')
    .row()
    .text('👨‍👩‍👧‍👦 Refferal')
    .text('🛄 Wallet')
    .row()
    .text('🔎 Information')
    .text('👨‍👩‍👧‍👦 Leaderboard')
    .build();

  ctx.reply(text, {
    reply_markup: { keyboard: keyboard, resize_keyboard: true },
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
}

module.exports = steps;
