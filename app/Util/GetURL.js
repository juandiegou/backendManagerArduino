const Env = use('Env');

const getUrl = () => {
  if (Env.get('NODE_ENV') === 'production') {
    return 'https://inventories-service.dogtorsoftware.com';
  } if (Env.get('NODE_ENV') === 'testing') {
    return 'https://inventories-service-dev.dogtorsoftware.com';
  }
  return 'https://be12-190-251-214-19.ngrok.io';
};

module.exports = getUrl;
