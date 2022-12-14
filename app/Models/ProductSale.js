

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const ProductVariation = use('App/Models/ProductVariation');

class ProductSale extends Model {

 
    variation() {
        return this.belongsTo('App/Models/ProductVariation');//.withTrashed();
      }

      product() {
        return this.belongsTo('App/Models/Product');//.withTrashed();
      }

}

module.exports = ProductSale;
