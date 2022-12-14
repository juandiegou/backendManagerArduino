/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const ProductVariation = use('App/Models/ProductVariation');
const Product = use('App/Models/Product');
const Expiration = use('App/Models/Expiration');

class ProductIncome extends Model {


  static get hidden() {
    return ['professional_id'];
  }

  static boot() {
    super.boot();

    this.addHook('afterCreate', async (productIncome) => {


      if(productIncome.expiration){
        await Expiration.create({
          expiration: productIncome.expiration,
          quantity: parseInt(productIncome.quantity, 10),
          product_variation_id: productIncome.product_variation_id,
          professional_id: productIncome.professional_id,
        })
      }
      const productVariation = await ProductVariation
        .find(productIncome.product_variation_id);
      productVariation.stock_quantity += parseInt(productIncome.quantity, 10);
      productVariation.purchase_price= productIncome.purchase_total_price/productIncome.quantity;
      await productVariation.save();
    });
    this.addHook('afterUpdate', async (productIncome) => {
      const productVariation = await ProductVariation
      .find(productIncome.product_variation_id);
if(productIncome.$originalAttributes.product_variation_id===productIncome.product_variation_id){

  productVariation.stock_quantity -= parseInt(productIncome.$originalAttributes.quantity, 10);
  productVariation.stock_quantity = (productVariation.stock_quantity<0)?0:productVariation.stock_quantity;
}else{
  const productVariationOriginal = await ProductVariation
  .find(productIncome.$originalAttributes.product_variation_id);
  productVariationOriginal.stock_quantity -= parseInt(productIncome.$originalAttributes.quantity, 10);
  productVariationOriginal.stock_quantity = (productVariationOriginal.stock_quantity<0)?0:productVariationOriginal.stock_quantity;
  await productVariationOriginal.save();

}
    productVariation.stock_quantity += parseInt(productIncome.quantity, 10);
    productVariation.purchase_price= productIncome.purchase_total_price/productIncome.quantity;

      await productVariation.save();
    });
    this.addHook('afterDelete', async (productIncome) => {
      const productVariation = await ProductVariation
        .find(productIncome.product_variation_id);

      productVariation.stock_quantity -= parseInt(productIncome.quantity, 10);
      productVariation.stock_quantity = (productVariation.stock_quantity<0)?0:productVariation.stock_quantity;

      await productVariation.save();
    });
  }

  productVariation() {
    return this.belongsTo('App/Models/ProductVariation').withTrashed();
  }

  provider() {
    return this.belongsTo('App/Models/Provider');
  }

  static async allIncomes({
    page,
    perPage,
    professionalId,
    orderBy = 'created_at',
    order = 'desc',
    find,
    provider,
    productVariationId
  }) {
    const query = this.query()
      .where({
        professional_id: professionalId,
      }).orderBy(orderBy, order);
    query.with('productVariation.product')
      .with('provider');

    if (find) {
      const products = await Product.query()
        .where('name', 'like', `%${find}%`)
        .orWhere('description', 'like', `%${find}%`)
        .fetch();

      const productVariation = await ProductVariation.query()
        .whereIn('product_id', products.toJSON().map(x => x.id))
        .orWhere('name', 'like', `%${find}%`).fetch();
      query.whereIn('product_variation_id', productVariation.toJSON().map(x => x.id));
    }

    if (provider) {
      query.where({ provider_id: provider });
    }
    if(productVariationId){
      query.where({product_variation_id:productVariationId})
    }

    let categories;
    if (page) {
      categories = query.paginate(page, perPage);
    } else {
      categories = query.fetch();
    }
    return categories;
  }

}

module.exports = ProductIncome;
