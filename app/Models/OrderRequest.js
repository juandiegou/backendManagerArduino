'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderRequest extends Model {

  static boot() {
    super.boot();
    // this.addHook('beforeSave', 'ProviderHook.LeadTime')
  }

  static get hidden() {
    return ['professional_id'];
  }


  provider() {
    return this.belongsTo('App/Models/Provider');
  }
}

module.exports = OrderRequest
