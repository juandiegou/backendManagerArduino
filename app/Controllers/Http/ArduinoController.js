var manager = require('../../Util/ArduinoManager');

class ArduinoController {

  constructor(){
    this.arduinoS = new manager();
  }

  async connect({ request, response }) {
    try {

      this.arduinoS.ledBlink();
    } catch (ex) {
      response.badRequest({
        message: 'Sin conexión'
      });
    }

    response.ok();
  }


  async disconnect({ request, response }) {
    if(this.arduinoS) {

      this.arduinoS
    }
    response.ok();
  }

  async ledOn({ request, response }) {
    this.arduinoS.ledOn();
    response.ok();

  }

  async ledOff({ request, response }) {
    this.arduinoS.ledOff();
    response.ok();

  }


  async servo({ request, response }) {
    this.arduinoS.servoSweep();
    response.ok();

  }

  async servoStop({ request, response }) {
    this.arduinoS.servoStop();
    response.ok();

  }


  async temperature({ request, response }) {

    const value = this.arduinoS.temperatureValue();
    response.ok(value);
  }


  async ligth({request, response}){
    const value = this.arduinoS.ligthValue();
    response.ok(value);
  }

  async play({request, response}){
    this.arduinoS.play();
    response.ok();
  }


  async mover({request, response}){
    this.arduinoS.fanMove();
    response.ok();
  }

  async detener ({request,response}){
    this.arduinoS.fanStop();
    response.ok();
  }


  async opendoor({request, response}){
    this.arduinoS.servoOpen();
    response.ok();
  }

  async closedoor ({request,response}){
    this.arduinoS.servoClose();
    response.ok();
  }
}


module.exports = ArduinoController
