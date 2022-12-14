'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Expiration extends Model {

    variation(){
        return this.belongsTo('App/Models/ProductVariation');
       
    }
}

module.exports = Expiration
