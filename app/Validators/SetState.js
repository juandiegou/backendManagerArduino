const Validator = require('./Validator');

class SetState extends Validator {

  get rules() {
    return {
      state: 'required|integer',
    };

  }

}

module.exports = SetState;
