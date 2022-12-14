const Model = use('Model');
const Database = use('Database');

class ProductPromotion extends Model {


  static get hidden() {
    return ['professional_id'];
  }

  static scopeIsValid(query) {
    query.where(Database.raw('limit_at >= CURRENT_DATE()'));
  }

  product() {
    return this.belongsTo('App/Models/Product').withTrashed();
  }

  static allPromotions({
    page,
    perPage,
    professionalId,
    orderBy = 'created_at',
    order = 'desc',
    valid,
  }) {
    const query = this.query()
      .where({
        professional_id: professionalId,
      })
      .with('product')
      .orderBy(orderBy, order);

    if (valid) {
      query.isValid();
    }
    let promotions;
    if (page) {
      promotions = query.paginate(page, perPage);
    } else {
      promotions = query.fetch();
    }
    return promotions;
  }

}

module.exports = ProductPromotion;
