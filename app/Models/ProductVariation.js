
const Model = use('Model');
const Product = use('App/Models/Product');
const Expiration = use('App/Models/Expiration');

class ProductVariation extends Model {


  static boot() {
    super.boot();
    this.addTrait('@provider:Lucid/SoftDeletes');
    this.addHook('beforeSave', 'AuditHook.audit')

 

   //  this.addTrait('Slugify')

    this.addHook('afterUpdate', async (modelInstance) => {
      let cont =  modelInstance.$originalAttributes.stock_quantity- modelInstance.stock_quantity;
      if(cont>0){
      const expirations= await Expiration.query()
        .where({product_variation_id : modelInstance.id})
        .andWhere('quantity','>', 0)
        .orderBy('expiration','desc')
        .fetch();
  
        for (const item of expirations.toJSON()) {
          
          const value = (item.quantity>=cont)?(parseInt(item.quantity,10)-parseInt(cont)):0;
          cont = parseInt(cont)- parseInt(item.quantity);
         

          const exp = await Expiration.find(item.id);
          exp.quantity = value;
          await exp.save();
          if(cont<=0){
            break;
          }
        }
      }  

    })
  }

  static get hidden() {
    return ['professional_id'];
  }

  product() {
    return this.belongsTo('App/Models/Product');//.withTrashed();
  }

  provider() {
    return this.belongsTo('App/Models/Provider');//.withTrashed();
  }

  sales() {
    return this.hasMany('App/Models/ProductSale');//.withTrashed();
  }
  
  

  static async allVariations({
    page,
    perPage,
    productId,
    professionalId,
    orderBy = 'name',
    order = 'asc',
    find,
    code,
    brandId,
    subCategory,
  }) {

    const query = this.query()
      .andWhere({
        professional_id: professionalId,
      })
      .with('product', (builder) => {
        builder
          .with('images')
          .with('tax')
          .promotion();
      })
      .whereNull('deleted_at')
      .orderBy(orderBy, order);

    if (productId) {
      query.where({ product_id: productId });
    }

    if (code) {
      query.where({ code });
    }
    if (brandId) {
      let products = await Product
        .query()
        .andWhere({professional_id:professionalId})
        .where({ brand_id: brandId })
        .fetch();
      products = products.toJSON().map(x => x.id);

      query.whereIn('product_id', products);
    }
    if (subCategory) {
      let products = await Product
      .query()
      .andWhere({professional_id:professionalId})
        .where({ sub_category_id: subCategory })
        .fetch();
      products = products.toJSON().map(x => x.id);

      query.whereIn('product_id', products);
    }
    if (find) {
      query.where((builder) => {
        builder.where('name', 'like', `%${find}%`)
          .orWhere('price_sale', 'like', `${find}`);
      });

       const products = await Product.query()
         .where({professional_id:professionalId})
         .andWhere((builder)=>{
            builder.where('name', 'like', `%${find}%`)
           .orWhere('description', 'like', `%${find}%`)
         })
         .fetch();
      const productIds = products.toJSON().map(x => x.id);

      query.orWhere((builder) => {
        builder.whereIn('product_id', productIds);
      });

    }
    let products;

    if (page) {
      products = query.paginate(page, perPage);
    } else {
      products = query.fetch();
    }
    return products;
  }

}

module.exports = ProductVariation;
