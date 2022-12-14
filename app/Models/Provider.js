/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Provider extends Model {

  static get hidden() {
    return ['professional_id'];
  }

  productIncomes() {
    return this.hasMany('App/Models/ProductIncome');
  }

  static allProviders({
    page,
    perPage,
    professionalId,
    orderBy = 'name',
    order = 'asc',
    find,
  }) {
    const query = this.query()
      .where({
        professional_id: professionalId,
      }).orderBy(orderBy, order);

    if (find) {
      query.where((builder) => {
        builder.orWhere('name', 'like', `%${find}%`)
          .orWhere('nit', 'like', `%${find}%`)
          .orWhere('phone', 'like', `%${find}%`);
      });
    }
    let providers;
    if (page) {
      providers = query.paginate(page, perPage);
    } else {
      providers = query.fetch();
    }
    return providers;
  }

}

module.exports = Provider;
