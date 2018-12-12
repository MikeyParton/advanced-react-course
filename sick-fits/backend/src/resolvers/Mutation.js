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
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    const deletedItem = await ctx.db.mutation.deleteItem({ where }, info);
    return deletedItem;
  }
};

module.exports = Mutations;
