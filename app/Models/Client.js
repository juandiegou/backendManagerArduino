/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Client extends Model {
  static get connection() {
    return "mysql_sso";
  }

  static boot() {
    super.boot();
    this.addTrait("@provider:Lucid/SoftDeletes");
  }

  invoices() {
    return this.hasMany("App/Models/SaleInvoice", "id", "user_id");
  }
}

module.exports = Client;
