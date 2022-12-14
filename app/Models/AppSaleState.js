/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class AppSaleState extends Model {


  invoices() {
    return this.hasMany('App/Models/AppInvoice');
  }

}

module.exports = AppSaleState;
