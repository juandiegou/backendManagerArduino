'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TransactionCategory extends Model {
  static get hidden() {
    return ['professional_id'];
  }

  static boot() {
    super.boot();
    this.addTrait('@provider:Lucid/SoftDeletes');
  }
  
}

module.exports = TransactionCategory
