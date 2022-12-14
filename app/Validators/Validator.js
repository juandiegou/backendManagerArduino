
const Antl = use('Antl');

class Validator {

  async fails(errorMessages) {
    return this.ctx.response.status(400).send(errorMessages[0]);
  }

  get messages() {
    return {
      required: Antl.formatMessage('messages.validation.required', { field: '{{field}}' }),
      integer: Antl.formatMessage('messages.validation.integer', { field: '{{field}}' }),
      date: Antl.formatMessage('messages.validation.date', { field: '{{field}}' }),
      string: Antl.formatMessage('messages.validation.string', { field: '{{field}}' }),
      exists: Antl.formatMessage('messages.validation.exists', { field: '{{field}}' }),
      unique: Antl.formatMessage('messages.validation.unique', { field: '{{field}}' }),
      float: Antl.formatMessage('messages.validation.float', { field: '{{field}}' }),
      in: Antl.formatMessage('messages.validation.in', { field: '{{field}}' }),
      max: Antl.formatMessage('messages.validation.max'),
      range: Antl.formatMessage('messages.validation.range'),
      above:Antl.formatMessage('messages.validation.above'),
    };
  }

}

module.exports = Validator;
