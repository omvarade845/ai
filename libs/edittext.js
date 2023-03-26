const { database } = require('../core');
const users = database('users');
const editMessage = async (ctx, button) => {
  let { bind_walllet, do_twitter, bind_twitter, join_group, join_channel, subscribed} =
    await users.findOne({ id: ctx.from.id });

  var done_bind = bind_twitter ? '✅' : '❌';
  var done_telegram = join_channel ? '✅' : '❌';
  var done_group = join_group ? '✅' : '❌';
var done_youtube = subscribed ? '✅' : '✅';
  var done_twitter = do_twitter ? '✅' : '❌';
  var bind_wallet = bind_walllet ? '✅' : '❌';

  var text =
    `📚 <i>🏦$MetaCateAI is a groundbreaking blockchain project that leverages the power of artificial intelligence to revolutionize the crypto industry. MetaCateAI offers users the ability to automate their trading strategies through the use of AI technology. This involves utilizing past financial data to enhance trading strategies, automating stop-loss orders, and implementing dollar-cost averaging during market downturns.</i>\n\n<b>🏦Holding $METACATEAI Turns You into a Financial Giant</b>\n.\n
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
    `8. <i><b>🔘Get 1 point for each successful refferal</i>\n\n` +
    `<b>⛔ Note:</b>\nYou must Complete all tasks to qualify for distribution or you wont get any token doing distribution`;
  try {
    await ctx.editMessageText(text, {
      reply_markup: button,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = editMessage;
