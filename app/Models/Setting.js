'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Setting extends Model {

  static get hidden() {
    return ['professional_id','employee_id','created_at'];
  }
}

module.exports = Setting
