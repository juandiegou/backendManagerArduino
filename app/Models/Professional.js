
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Professional extends Model {


    static get connection() {
        return 'mysql_sso';
      }
}

module.exports = Professional
