/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Promotion = use('App/Models/ProductPromotion');
const SubCategory = use('App/Models/SubCategory');
const ProductBrand = use('App/Models/ProductBrand');
const Category = use('App/Models/Category');

class Product extends Model {

  static boot() {
    super.boot();
    this.addTrait('@provider:Lucid/SoftDeletes');

  }

  static get hidden() {
    return ['professional_id'];
  }

  images() {
    return this.hasMany('App/Models/ProductImage');
  }

  variations() {
    return this.hasMany('App/Models/ProductVariation');
  }

  tags() {
    return this.belongsToMany('App/Models/Tag').pivotTable('product_tags');
  }

  promotion() {
    return this.hasOne('App/Models/ProductPromotion');
  }

  sub_category() {
    return this.belongsTo('App/Models/SubCategory');
  }

  brand() {
    return this.belongsTo('App/Models/ProductBrand', 'brand_id', 'id');
  }

  tax() {
    return this.belongsTo('App/Models/Tax', 'tax_id', 'id');
  }

  sales() {
    return this.hasMany('App/Models/ProductSale');//.withTrashed();
  }
  
  static scopePromotion(query) {
    return query.with('promotion', (x) => {
      x.isValid();
    });
  }

  static async allProducts({
    page,
    perPage,
    subCategoryId,
    brandId,
    isPublic,
    professionalId,
    orderBy = 'name',
    order = 'asc',
    find,
    promotion,
    categoryId,
  }) {
    const query = this.query()
      .where({
        professional_id: professionalId,
      })
      .with('images')
      .with('sub_category')
      .with('brand')
      .promotion()

      .orderBy(orderBy, order);
    if (subCategoryId) {
      query.where({ sub_category_id: subCategoryId });
    }
    
    if (brandId) {
      query.where({ brand_id: brandId });
    }

    if (isPublic !== null) {
      query.where({ public: isPublic });
    }
    if (promotion) {
      let promotions = await Promotion.query().isValid().fetch();
      promotions = promotions.toJSON().map(x => x.product_id);
      query.whereIn('id', promotions);

    }
    if (categoryId) {
      let subCategories = await SubCategory.query().where({ category_id: categoryId }).fetch();
      subCategories = subCategories.toJSON().map(x => x.id);
      query.whereIn('sub_category_id', subCategories);
    }


    if (find) {

      let subCategories = await SubCategory.query().where('name', 'like', `%${find}%`).fetch();
      subCategories = subCategories.toJSON().map(x => x.id);

      let brands = await ProductBrand.query().where('name', 'like', `%${find}%`).fetch();
      brands = brands.toJSON().map(x => x.id);


      query.where((builder) => {
        builder.where('name', 'like', `%${find}%`)
          .orWhere('description', 'like', `%${find}%`)
          .orWhere((call)=>
          call.whereIn('sub_category_id', subCategories))
          .orWhere((call)=>
          call.whereIn('brand_id', brands));
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

module.exports = Product;
