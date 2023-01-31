const { database, bot, Composer, InlineKeyboard, Router } = require('../core');
const { bot_token, admin } = require('../core/config');
const composer = new Composer();
const router = new Router((ctx) => ctx.session.step);
const botdata = database('bot');
const users = database('users');
const allUsers = database('users');
const { steps } = require('../generators.js/index');

composer.hears('📚 Account', async (ctx, next) => {
  let { user_step, balance, pending_refs } = await users.findOne({
    id: ctx.from.id,
  });
  if (user_step == 'Done') {
    let time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Accra' });
    ctx.reply(
      `🆔 <b>Account Information</b>\n` +
        `👤 <b>User:</b> <code>${ctx.from.id} | ${ctx.from.first_name}</code>\n\n` +
        `💰 <b>Balance:</b> <code>${balance} POINTS</code>\n` +
        `⚡ <b>Status:</b><code> ✅ Verified</code>\n\n` +
        `⏰ <b>Server Time:</b> <code>${time}</code>`,
      { parse_mode: 'HTML' },
    );
  } else {
    await steps(ctx);
  }
  await next();
});

composer.hears('👨‍👩‍👧‍👦 Refferal', async (ctx, next) => {
  let { user_step, total_invited, pending_refs } = await users.findOne({
    id: ctx.from.id,
  });
  if (user_step == 'Done') {
    var text =
      `<b>👨‍👩‍👧‍👦 Refferal Information</b>\n\n` +
      `⚡ <b>Verified Invited:</b> <code>${total_invited}</code>\n` +
      `⏳ <b>Pending Invited:</b> <code>${pending_refs}</code>\n\n` +
      `✅ <b>Refferal Link:</b>\n https://t.me/${ctx.me.username}?start=${ctx.from.id}\n\n` +
      `⛔ <b>Note:</b>\n` +
      `<i>- Share your refferal link and earn 1 point for successful invitation </i>\n` +
      `<i>- pending invites are users who have not completed task , verified invites are users who have completed task</i>`;
    await ctx.reply(text, { parse_mode: 'HTML' });
  } else {
    await steps(ctx);
  }
  await next();
});

composer.hears('🛄 Wallet', async (ctx, next) => {
  let { user_step, wallet } = await users.findOne({ id: ctx.from.id });
  if (user_step == 'Done') {
    await ctx.reply(
      `<b>⚡ Your BSC Wallet for future distribution is</b>\n\n<code>${wallet}</code>`,
      {
        reply_markup: new InlineKeyboard().text(
          '✔ Change Wallet',
          'changewallet',
        ),
        parse_mode: 'HTML',
      },
    );
  } else {
    await steps(ctx);
  }
  await next();
});

composer.hears('👨‍👩‍👧‍👦 Leaderboard', async (ctx, next) => {
  var msg = '<b>🔝 Top 50 Highest Referrals</b>\n\n';
  let users = await allUsers.find({});

  users.sort(doSort);
  var result = [];

  for (var i = 0; i < 50; i++) {
    let item = users[i];

    if (!item[i]) {
      break;
    }

    result.push(item);
  }

  for (var i = 0; i < 50; i++) {
    let u = users[i];
    if (!u) {
      break;
    }
    if (u.total_invited > 0) {
      let id = i * 1 + 1;
      let fullname = formatFullname(u.first_name, u.last_name);
      msg += `${id}. ${fullname} - ${u.total_invited}\n`;
    }
  }

  await ctx.reply(msg, {
    parse_mode: 'html',
  });

  await next();
});

composer.hears('🔎 Information', async (ctx, next) => {
  let { user_step } = await users.findOne({ id: ctx.from.id });
  if (user_step == 'Done') {
    ctx.reply(
`<i>We Are <b>COINFACE,</b>
We Are A Team Practicing Islam And Have Brought This Project In A HALAL Manner And Our Token Is Built On Binance Smart Chain And Yes 
It’s A Secure And Transparent Token With Anti Crime Financial Standards. Also Has Massive Level Of Features & Functions In Our Token With Type Level – 7</i> (<b>Smart Contract Address</b>).


<b>✅ Token Address:</b> <code>CoinFace (CFT)</code>

🔹<b>Decimals:</b> <code>3</code>

<b>💲 Symbol:</b> <code>CFT</code>

<b>📊 Supply: </b> <code>150000000 </code>

<b>🔸Explorer:</b> <a href ="https://bscscan.com/token/radimon">Binance Smart Chain</a>`,
      { parse_mode: 'HTML', disable_web_page_preview: true },
    );
  } else {
    await steps(ctx);
  }
  await next();
});

bot.use(composer);

function doSort(a, b) {
  if (a.total_invited > b.total_invited) return -1;
  if (a.total_invited < b.total_invited) return 1;
}

function formatFullname(first, last) {
  if (!last) {
    return first;
  } else {
    return first + ' ' + last;
  }
}