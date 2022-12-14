
const Logger = use('Logger');
const { LogicalException } = require('@adonisjs/generic-exceptions');

class CustomException extends LogicalException {

  async handle(error, { response }) {
    response.status(error.status).json({
      message: error.message,
      errors: error.errors || {},
      status: error.status,
    });
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    const content = {
      statusCode: error.status,
      endpoint: request.originalUrl(),
      method: request.method(),
      message: error.message,
      headers: request.headers(),
      body: request.body,
    };

    if (error.status >= 400 && error.status < 500) {
      Logger.info(error, content);
    }
    if (error.status >= 500) {
      Logger.error(error, content);
    }
  }

}

module.exports = CustomException;
