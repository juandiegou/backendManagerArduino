"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Subscription extends Model {
  invoice() {
    return this.belongsTo("App/Models/SaleInvoice", "invoice_id", "id");
  }

  presentation() {
    return this.belongsTo(
      "App/Models/ProductVariation",
      "product_variation_id",
      "id"
    );
  }

  client() {
    return this.belongsTo("App/Models/Client");
  }

  static allSubscriptions({
    page,
    perPage,
    id,
    orderBy = "created_at",
    order = "desc",
  }) {
    const query = this.query()
      .with("invoice")
      .where({
        client_id: id,
      })

      .orderBy(orderBy, order);

    let subscriptions;
    if (page) {
      subscriptions = query.paginate(page, perPage);
    } else {
      subscriptions = query.fetch();
    }
    return subscriptions;
  }
}

module.exports = Subscription;
