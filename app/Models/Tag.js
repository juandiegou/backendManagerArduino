'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
  static get hidden() {
    return ['professional_id'];
  }
}

module.exports = Tag
