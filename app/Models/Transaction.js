const Account = use('App/Models/Account');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transaction extends Model {

  static boot() {
    super.boot();
    this.addHook('beforeCreate', async (data) => {
     
  
      const account = await Account.find(data.account_id);

      if(data.money_out==1) {
        account.balance -= parseInt(data.value, 10);
        data.balance = account.balance;
      }else{
        account.balance +=  parseInt(data.value,10);
        data.balance = account.balance;

      }

      await account.save();

    });

    this.addHook('afterDelete', async (data) => {
     
      const account = await Account.find(data.account_id);

      if(data.money_out==1) {
        account.balance += parseInt(data.value, 10); 
    
      }else{
        account.balance -=  parseInt(data.value,10); 
      }

      await account.save();

    });

  }
  static get hidden() {
    return ['professional_id'];
  }

  category() {
    return this.belongsTo('App/Models/TransactionCategory','transaction_category_id','id');
  }

  account() {
    return this.belongsTo('App/Models/Account');
  }
}

module.exports = Transaction
