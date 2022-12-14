/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');


class ProductBrand extends Model {


  products() {
    return this.hasMany('App/Models/Product', 'id', 'brand_id');
  }

  static allBrands({
    page,
    perPage,
    orderBy = 'name',
    order = 'asc',
    find,
    professional_id
  }) {
    const query = this.query()
    .where({professional_id})
      .orderBy(orderBy, order);

    if (find) {
      query.where('name', 'like', `%${find}%`);
    }
    let brands;
    if (page) {
      brands = query.paginate(page, perPage);
    } else {
      brands = query.fetch();
    }
    return brands;
  }

}

module.exports = ProductBrand;
