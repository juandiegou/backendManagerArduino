'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SettignSso extends Model {

    static get table() {
        return 'settings'
    }

    static get connection() {
        return 'mysql_sso'
    }
}

module.exports = SettignSso
