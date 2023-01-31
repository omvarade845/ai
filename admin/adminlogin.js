const { database, bot, Composer, InlineKeyboard } = require('../core');
const { bot_token, admin } = require('../core/config');
const { createMenu } = require('../libs');
const composer = new Composer();

const botdata = database('bot');
const button = new InlineKeyboard()

  .text('➕ Manage Admin', 'addadmin')
  .row()
  .text('👤 Manage User', 'users')
  .text('📢 Broadcast', 'broadcast')
  .row()
  .text('🔐 Logout Panel', 'logout');

const adminlogin = async (ctx, next) => {
  let botdb = await botdata.findOne({ id: bot_token });
  if (!admin && botdb.admin == 'not set') {
    ctx.reply('*😥 Bot does not have any admin*', { parse_mode: 'markdown' });
  } else if (ctx.from.id == admin || botdb.admin.includes(ctx.from.id)) {
    ctx.reply('👮‍♂️ Welcome to the admin Panel', {
      reply_markup: button,
      parse_mode: 'markdown',
    });
  }
  await next();
};

const logout = async (ctx, next) => {
  await ctx.deleteMessage();
  await next();
};

const adminlog = async (ctx, next) => {
  await ctx.editMessageText('👮‍♂️ Welcome to the admin Panel', {
    reply_markup: button,
    parse_mode: 'markdown',
  });
  await next();
};

composer.command('adminlogin', adminlogin);

composer.callbackQuery('adminlogin', adminlog);
composer.callbackQuery('logout', logout);

bot.use(composer);
