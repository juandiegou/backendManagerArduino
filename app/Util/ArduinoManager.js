const Arduino = require("johnny-five")
let manager;
let servo;
let sensorTemp;
let photoresistor;
let led;
let fan;
let proximity;
let piezo;
let potentiometer;
let buzer;
const ligth = { value: 0 };
const temperature = { value: 0 }
const distance = { value: 0 }
const temperatureStatics = { max:0, min:50}
const ligthStatics = {max:0, min: 1023}



/***
 * clase intermediaria que sirve para realizar la manipulacion de los sensores y acruadores haciendo uso de johnny five
 */

class ArduinoManager {

  constructor(){
    manager = new Arduino.Board({port:"COM1"});

    manager.on("ready", () => {
      led = new Arduino.Led(13); //luz en pion 13
      servo = new Arduino.Servo(10); // servo en el pin 10
      photoresistor = new Arduino.Sensor({ pin: "A2", freq: 250 }); //fotoresistencia en la entrada analoga A2
      fan = new Arduino.Motor({ pin: 5 }); // ventilador en el pin 5
      proximity = new Arduino.Proximity({ controller: "HCSR04",  pin: "A15" }); //ultrasonico en la entrada analoga A15
      piezo = new Arduino.Piezo(3) //piezo en el pin 3
      potentiometer = new Arduino.Sensor("A3"); //potenciometro en entrada A3
      sensorTemp = new Arduino.Thermometer({controller:"LM35",pin:"A0"})

      manager.repl.inject({ piezo, fan, photoresistor, servo, led,sensorTemp });
      
      photoresistor.on("change", function() {
        ligth.value = this.value;
      });

      // proximity.on("data", () =>{
      //   console.log(proximity.centimeters);
      //   distance.value=proximity.centimeters;
      // });

      // sensorTemp.on("change", () =>{
      //   console.log("temperature", sensorTemp.C)
      // });

      potentiometer.on("change", () => {
        const {value} = potentiometer;
        const degree = this.mapToDegree(value,0,1023,0,180);
        // console.log("Sensor: ");
        // console.log("  value  : ", degree);
        // console.log("-----------------");
        this.servoToDegree(degree);
      });


    });
  }

  mapToDegree( x,  in_min,  in_max,  out_min,  out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }


  ledBlink() {
    if (led) {
      led.blink();
    }
  }

  ledOn() {
    if (led) {
      led.on();
    }
  }

  ledOff(){
    if(led){
      led.off();
    }
  }

  temperatureValue() {
    if (sensorTemHum) {
      return (temperature);
    } else {
      return -1;
    }
  }

  servoToDegree(value){
    if(servo){
      servo.to(value);
    }
  }

  servoSweep() {
    if (servo) {
      servo.sweep();
    }
  }

  servoStop() {
    if (servo) {
      servo.stop();
    }
  }

  servoClose(){
    if(servo){
      servo.max();
    }
  }

  servoOpen(){
    if(servo){
      servo.min();
    }
  }


  ligthValue() {
    if (photoresistor) {
      return (ligth);
    } else {
      return -1;
    }

  }

  play() {
    if (piezo) {
      piezo.play({
        song: [
          ["C4", 1 / 4],
          ["D4", 1 / 4],
          // ["F4", 1 / 4],
          // ["D4", 1 / 4],
          // ["A4", 1 / 4],
          // [null, 1 / 4],
          // ["A4", 1],
          // ["G4", 1],
          // [null, 1 / 2],
          // ["C4", 1 / 4],
          // ["D4", 1 / 4],
          // ["F4", 1 / 4],
          // ["D4", 1 / 4],
          // ["G4", 1 / 4],
          // [null, 1 / 4],
          // ["G4", 1],
          // ["F4", 1],
          // [null, 1 / 2]
        ],
        tempo: 100
      });
    }
  }

  fanMove() {
    if (fan) {
      fan.start();
    }
  }

  fanStop() {
    if (fan) {
      fan.stop();
    }
  }


  /***
   * utilizado para el calculo de las estadisticas de la proxmidad
   */

  proximityStaticsCalculator(value){
    if(distance.max<value){
      distance.max=value;
    }
    if(distance.min>value){
      distance.min = value;
    }
  }

  /**
   * utilizado para realizar el calculo de las estadisticas de la limuninosidad
   * @param {*} value  valor actual del sensor
   */

  ligthStaticsCalculator(value){
    if(ligthStatics.max<value){
      ligthStatics.max=value;
    }
    if(ligthStatics.min>value){
      ligthStatics.min = value;
    }
  }

}

module.exports = ArduinoManager;