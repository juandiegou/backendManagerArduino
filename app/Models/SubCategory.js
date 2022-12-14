
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SubCategory extends Model {


  static get hidden() {
    return ['professional_id'];
  }

  category() {
    return this.belongsTo('App/Models/Category');
  }

  products() {
    return this.hasMany('App/Models/Product');
  }

  static allSubCategories({
    page,
    perPage,
    categoryId,
    professionalId,
    orderBy = 'name',
    order = 'asc',
    find,
  }) {
    const query = this.query()
      .where({
        professional_id: professionalId,
      }).orderBy(orderBy, order)
      .with('category');

    if (categoryId) {
      query.where({ category_id: categoryId });
    }

    if (find) {
      query.where('name', 'like', `%${find}%`);
    }
    let subCategories;
    if (page) {
      subCategories = query.paginate(page, perPage);
    } else {
      subCategories = query.fetch();
    }
    return subCategories;
  }

}

module.exports = SubCategory;
