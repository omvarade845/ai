const {
  bot,
  database,
  Router,
  Composer,
  InlineKeyboard,
} = require('../core/index');
const users = database('users');
const botdb = database('bot');
const composer = new Composer();
const { steps } = require('../generators.js/index');
const router = new Router((ctx) => ctx.session.step);

composer.callbackQuery('setwallet', async (ctx, next) => {
  var text = `<b>✏ Send Your Bsc(Bep20) wallet for token distribution</b>`;
  ctx.editMessageText(text, { parse_mode: 'HTML' });
  ctx.session.step = 'set-wallet';
  await next();
});

composer.callbackQuery('changewallet', async (ctx, next) => {
  var text = `<b>✏ Send Your New Bsc(Bep20) wallet for token distribution</b>`;
  ctx.editMessageText(text, { parse_mode: 'HTML' });
  ctx.session.step = 'changewallet';
  await next();
});

router.route('changewallet', async (ctx) => {
  const msg = ctx.msg?.text ?? '';
  if (msg.charAt(0) == '0' && msg.charAt(1) == 'x') {
    let isvalid = await users.findOne({ wallet: msg });
    if (isvalid) {
      ctx.session.step = 'idle';
      await ctx.reply(
        '⛔ <b>Error:</b> <i>Wallet already exists in database</i>',
        { parse_mode: 'HTML' },
      );
    } else {
      ctx.session.step = 'idle';
      await users.updateOne(
        { id: ctx.from.id },
        {
          $set: {
            wallet: msg,
          },
        },
      );
      await ctx.reply('✅ <b>Wallet have been successfully added</b>', {
        parse_mode: 'HTML',
      });
    }
  } else {
    ctx.session.step = 'idle';
    await ctx.reply(
      '⛔ <b>Error:</b> <i>This Does not look like a bep20 wallet</i>',
      { parse_mode: 'HTML' },
    );
  }
});
router.route('set-wallet', async (ctx) => {
  const msg = ctx.msg?.text ?? '';
  if (msg == '/start') {
    ctx.session.step = 'idle';
    return;
  }
  // ctx.deleteMessage();
  if (msg.charAt(0) == '0' && msg.charAt(1) == 'x') {
    let isvalid = await users.findOne({ wallet: msg });
    if (isvalid) {
      await ctx.reply(
        '⛔ <b>Error:</b> <i>Wallet already exists in database</i>',
        { parse_mode: 'HTML' },
      );
    } else {
      ctx.session.step = 'idle';
      ctx.session.bind_wallet = 'done';
      await users.updateOne(
        { id: ctx.from.id },
        {
          $set: {
            user_step: 'Done',
            wallet: msg,
            bind_walllet: true,
            is_verified: true,
          },
          $inc: { balance: 10 },
        },
      );

      let { refferal_id, paid_for_refer } = await users.findOne({
        id: ctx.from.id,
      });
      if (refferal_id != 'no one' && !paid_for_refer) {
        await users.updateOne(
          { id: ctx.from.id },
          { $set: { paid_for_refer: true } },
        );
        await users.updateOne(
          { id: refferal_id },
          {
            $pull: { pending_ref_users: ctx.from.id },
            $inc: { pending_refs: -1, total_invited: 1, balance: 1 },
            $push: { invited_users: ctx.from.id },
          },
        );

        await ctx.api.sendMessage(
          refferal_id,
          '✅ <b>A user you invited completed registration and you earned 1 $LBT</b>',
          { parse_mode: 'HTML' },
        );
      }
      await ctx.reply('✅ <b>Wallet have been successfully added</b>', {
        parse_mode: 'HTML',
      });

      await ctx.reply(
        `<b>🎊 Congratulation 🎊</b>\n<i>You Completed all airdrop tasks and earn 10 $METACATEAI, invite your friends and earn 1 $METACATEAI for successfully invitation </i>`,
        { parse_mode: 'HTML' },
      );

      await steps(ctx);
    }
  } else {
    await ctx.reply(
      '⛔ <b>Error:</b> <i>This Does not look like a bep20 wallet</i>',
      { parse_mode: 'HTML' },
    );
  }
});

bot.use(router);
bot.use(composer);
