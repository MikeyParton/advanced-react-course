const Mutations = {
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
  }
};

module.exports = Mutations;
