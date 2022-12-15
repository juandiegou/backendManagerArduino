const Arduino = require("johnny-five")
let manager;
let servo;
let sensorTemHum;
let photoresistor;
let led;
let fan;
let proximity;
let piezo;
const ligth = { value: 0 };
const temperature = { value: 0 }
const distance = { value: 0 }
const temperatureStatics = { max:0, min:50}
const ligthStatics = {max:0, min: 1023}





class ArduinoManager {

  constructor(){
    manager = new Arduino.Board({port:"COM1"});

    manager.on("ready", () => {
      led = new Arduino.Led(13); //luz en pion 13
      servo = new Arduino.Servo(10); // servo en el pin 10
      photoresistor = new Arduino.Sensor({ pin: "A2", freq: 250 }); //fotoresistencia en la entrada analoga A2
      fan = new Arduino.Motor({ pin: 5 }); // ventilador en el pin 5
      proximity = new Arduino.Proximity({ controller: "HCSR04",  pin: 7 }); //ultrasonico en la entrada analoga A0
      piezo = new Arduino.Piezo(3) //piezo en el pin 3
      var multi = new Arduino.Multi({
        controller: "DHT11_I2C_NANO_BACKPACK"
      });

      manager.repl.inject({ piezo, fan, photoresistor, servo, led,multi });
      
      photoresistor.on("change", function() {
        ligth.value = this.value;
      });

      proximity.on("data", () =>{
        console.log(proximity.centimeters);
        distance.value=proximity.centimeters;
      })



    });
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
          ["F4", 1 / 4],
          ["D4", 1 / 4],
          ["A4", 1 / 4],
          [null, 1 / 4],
          ["A4", 1],
          ["G4", 1],
          [null, 1 / 2],
          ["C4", 1 / 4],
          ["D4", 1 / 4],
          ["F4", 1 / 4],
          ["D4", 1 / 4],
          ["G4", 1 / 4],
          [null, 1 / 4],
          ["G4", 1],
          ["F4", 1],
          [null, 1 / 2]
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



}

module.exports = ArduinoManager;