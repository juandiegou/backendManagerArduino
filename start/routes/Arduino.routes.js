const Route = use('Route');
const controller = 'ArduinoController';

Route.group(()=> {
  Route.get('/connect', `${controller}.connect`);
  Route.get('/disconnect',`${controller}.disconnect`);
  Route.get('/on',`${controller}.ledOn`);
  Route.get('/off',`${controller}.ledOff`);
  Route.get('/run', `${controller}.servo`);
  Route.get('/stop',`${controller}.servoStop`);
  Route.get('/temperature',`${controller}.temperature`);
  Route.get("/ligth",`${controller}.ligth`);
  Route.get("/play", `${controller}.play`);
  Route.get("/mover", `${controller}.mover`);
  Route.get("/detener", `${controller}.detener`);
  Route.get("/servostart", `${controller}.opendoor`);
  Route.get("/servoend", `${controller}.closedoor`);

});
