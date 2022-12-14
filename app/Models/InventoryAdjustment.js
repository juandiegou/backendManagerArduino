'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class InventoryAdjustment extends Model {

    products(){
        return this.hasMany('App/Models/ProductInventoryAdjustment')
    }
}

module.exports = InventoryAdjustment
