'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {

    static get connection() {
        return 'mysql_sso';
      }
}

module.exports = Permission
