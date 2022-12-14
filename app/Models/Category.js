
const Model = use('Model');

class Category extends Model {

  static get hidden() {
    return ['professional_id'];
  }

  subCategories() {
    return this.hasMany('App/Models/SubCategory');
  }

  static allCategories({
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
      }).orderBy(orderBy, order);

    if (categoryId) {
      query.where({ category_id: categoryId });
    }

    if (find) {
      query.where('name', 'like', `%${find}%`);
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

module.exports = Category;
