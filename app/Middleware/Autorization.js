const Antl = use('Antl');
const axios = require('axios');
const Professional = use('App/Models/Professional');
const Env = use('Env');

class Authorization {

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    const { authorization } = request.request.headers;
    const { method, url } = request.request;

    const data = JSON.stringify({
      method, url,
    });

    const req = await axios({
      method: 'GET',
      url: `${Env.get('DASHBOARD_SERVICE')}/professional_profile`,
      headers: {
        'Content-Type': 'application/json',
        authorization,
      },
      data,
    }).then(res => res).catch(() => false);

    if (!req) {

      return response.status(401).json({
        message: Antl.formatMessage('messages.InvalidJwtToken'),
      });
    }
    
    if (req.data.locked) {
      return response.unauthorized({ message: 'El usuario se encuentra deshabilitado!!' });
    }  

    if (!req.data.settings) {
      return response.status(401).json({
        message: 'No autorizado',
      });
    }


    request.professional_id = req.data.settings.professional_id;
    request.professional = req.data;

    await next();
  }

}

module.exports = Authorization;
