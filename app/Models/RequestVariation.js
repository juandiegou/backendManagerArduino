'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RequestVariation extends Model {

    variation(){
        return this.belongsTo('App/Models/ProductVariation','variation_id','id');
    }

}

module.exports = RequestVariation
