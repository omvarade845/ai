const {
  bot,
  database,
  Router,
  Composer,
  InlineKeyboard,
} = require('../core/index');
const { editMessage, checkSub } = require('../libs');
const users = database('users');
const botdb = database('bot');
const composer = new Composer();
const { steps } = require('../generators.js/index');
const router = new Router((ctx) => ctx.session.step);
let button = new InlineKeyboard()
  .url('Join Our Channel', 'https://t.me/metacateaichannel')
  .row()
  .url('Join Our Group', 'https://t.me/MetaCateAigroup')
  .row()
  .text('Continue', 'joined');

let button2 = new InlineKeyboard()
  .url('Join Our Channel', 'https://t.me/metacateaichannel')
  .row()
  .text('Continue', 'joined');

let button3 = new InlineKeyboard()
  .url('Join Our Group', 'https://t.me/MetaCateAigroup')
  .row()
  .text('Continue', 'joined');

composer.callbackQuery('letstart', async (ctx, next) => {
  ctx.editMessageReplyMarkup({ reply_markup: button });
  await next();
});

composer.callbackQuery('joined', async (ctx, next) => {
  // const user = await users.findOne({ id: ctx.from.id });
  // const { is_verified, user_step } = user;
  // if (user_step == 'telegram task') {
  let { status, message, joined } = await checkSub(ctx);
  if (status) {
    ctx.session.telegram = 'joined';
    ctx.session.group = 'joined';
    await users.updateOne(
      { id: ctx.from.id },
      {
        $set: {
          user_step: 'twitter task',
          join_channel: true,
          join_group: true,
        },
      },
    );

    ctx.deleteMessage();
    await steps(ctx);
  } else {
    if (joined == 'none') {
      await ctx.answerCallbackQuery({ text: message, show_alert: true });
    } else if (joined == 'channel') {
      await users.updateOne(
        { id: ctx.from.id },
        {
          $set: {
            join_channel: true,
            join_group: false,
          },
        },
      );
      await ctx.answerCallbackQuery({ text: message, show_alert: true });
      await editMessage(ctx, button3);
    } else if (joined == 'group') {
      await users.updateOne(
        { id: ctx.from.id },
        {
          $set: {
            join_group: true,
            join_channel: false,
          },
        },
      );
      ctx.session.group = 'joined';
      await ctx.answerCallbackQuery({ text: message, show_alert: true });
    } else if (joined == 'error') {
      await ctx.answerCallbackQuery({ text: message, show_alert: true });
    }
  }
  // } else {
  //   await steps(ctx);
  // }
  await next();
});

bot.use(composer);
