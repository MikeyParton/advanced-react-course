const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permission: { set: ['USER'] }
      }
    }, info);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 Year
    });

    return user;
  },
  async login(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error('No account')
    };
    if (!bcrypt.compareSync(args.password, user.password)) {
      throw new Error('Wrong password')
    };
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 Year
    });
    return user;
  },
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: args
    }, info);
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const { id, ...data } = args
    const item = await ctx.db.mutation.updateItem({
      data,
      where: { id }
    }, info)
    return item
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    const deletedItem = await ctx.db.mutation.deleteItem({ where }, info);
    return deletedItem;
  }
};

module.exports = Mutations;
