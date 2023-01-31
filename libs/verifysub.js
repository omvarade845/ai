const checkSub = async (ctx) => {
  try {
    const channel = await ctx.api.getChatMember(
      '@airdropfluent',
      ctx.from.id,
    );
    const group = await ctx.api.getChatMember(
      '@airdropfluentgroup',
      ctx.from.id,
    );
    const sub = ['creator', 'admininstrator', 'member'].includes(
      channel.status,
    );
    const sub2 = ['creator', 'admininstrator', 'member'].includes(group.status);
    if (sub && sub2) {
      return { status: true, message: null, joined: 'all' };
    } else if (!sub && !sub2) {
      return {
        status: false,
        message: '⛔ You need To join both Chats To proceed',
        joined: 'none',
      };
    } else if (!sub && sub2) {
      return {
        status: false,
        message: '😶 You Forgot To join channel',
        joined: 'group',
      };
    } else if (sub && !sub2) {
      return {
        status: false,
        message: '😶 You Forgot To join Group',
        joined: 'channel',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: '😥 Error Happened',
      joined: 'error',
    };
  }
};

module.exports = checkSub;
