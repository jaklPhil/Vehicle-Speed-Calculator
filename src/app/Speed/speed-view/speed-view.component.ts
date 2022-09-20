
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Trip } from 'src/app/model/trip';
import { Vehicle } from 'src/app/model/vehicle';
import { LocalService } from 'src/app/shared/local.service';
import { CommaDecPipe } from 'src/app/shared/comma.dec.pipe';
import { GeneralService } from 'src/app/shared/general.service';
declare function require(moduleName: string): any;
@Component({
  selector: 'app-speed-view',
  templateUrl: './speed-view.component.html',
  styleUrls: ['./speed-view.component.css']
})

export class SpeedViewComponent implements OnInit {
 
  form:FormGroup;
  decription:string="";
  powerUnit:string="";
  timeUnit:string="min";
  caller:string="";
  calcBy:string="";
  public completed:boolean =false;
  public ready:boolean = false;
  public speedSet:boolean = false;
  vehicle:Vehicle;
  trip:Trip;
  
  constructor(
    
    private decPipe: CommaDecPipe, 

    private generalService:GeneralService,  
    private localService:LocalService
    ) { 
    this.form = new FormGroup({
      airDesity: new FormControl(0,[Validators.required, Validators.min(0)]),
      surface: new FormControl(0,[Validators.required, Validators.min(0)]),
      velocity: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      driveResistance: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      wheelPower: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      drivePower: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      tripTime: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      lenght: new FormControl(0,[Validators.required, Validators.min(0.01)]),
      unitWheel: new FormControl("",[Validators.required]),
      unitDrive: new FormControl("",[Validators.required]),
      unitTime: new FormControl("",[Validators.required])
    });

    //get data
    this.vehicle = localService.getVehicle();
    this.trip = localService.getTrip();
    this.calcMinForceValid();
    this.stockPowerUnit()
    //push values to form
    this.formSetter(this.trip);
    //update Data
    localService.changeVehicle.subscribe(()=>{
      this.vehicle = localService.getVehicle();
      //recalculate
      console.log("recalc");
      this.calcMinForceValid();
      this.recalculate();
      this.formSetter(this.trip);

    });
    localService.changeTrip.subscribe(()=>{
      this.trip = localService.getTrip()
      this.formSetter(this.trip);

    });
}


ngOnInit() { 
  window.scrollTo(0,document.body.scrollHeight);
}

scrollToBottom(){
  window.scrollTo(0,document.body.scrollHeight);
}
  
  
  calculate(event:Event){
    this.valueSetter();
    //calculate Trip
    this.calcCaller((event.target as Element).id);

    //Check values
    this.speedSet = this.trip.velocity > 0;
    this.ready = this.trip.tripTime > 0;
    this.update();
    //update Form
    this.formSetter(this.trip);
  }
  
  recalculate(){
    
    if (this.trip.velocity <= 0){
      return
    }
    
    this.calcSpeed(this.trip.velocity);
    this.decription = "Werte wurden anhand der Geschwindigkeit berechnet.";
    this.caller = "velocity";
    this.trip.drivePower = this.trip.wheelPower / this.vehicle.driveEff;
    this.calcLenght(this.trip.lenght);
    this.calcEnergie();
    this.formSetter(this.trip);
    this.update();
  }
  recalculateCondition(){
    this.valueSetter();
    this.recalculate();
   
  }  

  private calcCaller(caller:string){
    switch (caller) {
      case "velocity":
        this.caller = caller;
        this.decription = "Werte wurden anhand der Geschwindigkeit berechnet.";
        this.calcSpeed(this.trip.velocity);
        this.trip.drivePower = this.trip.wheelPower / this.vehicle.driveEff;
        this.calcLenght(this.trip.lenght);
      break;

      case "wheelPower":
        this.caller = caller;
        this.decription = "Werte wurden anhand der Radleistung berechnet.";
        this.calcPower(this.trip.wheelPower);
        this.trip.drivePower = this.trip.wheelPower / this.vehicle.driveEff;
        this.calcLenght(this.trip.lenght);
      break;

      case "drivePower":  
      this.caller = caller;
      this.decription = "Werte wurden anhand der Antriebsleistung berechnet.";
        this.trip.wheelPower = this.trip.drivePower * this.vehicle.driveEff;
        this.calcPower(this.trip.wheelPower);
        this.calcLenght(this.trip.lenght);
      break;

      case "driveResistance":
        if (this.trip.driveResistance<=this.calcGndF()){
          this.generalService.showMSG($("#msgErrorTrip"));
        }
        this.caller = caller;
        this.decription = "Werte wurden anhand des Fahrwiderstandes berechnet.";
        this.calcForce(this.trip.driveResistance);
        this.trip.drivePower = this.trip.wheelPower / this.vehicle.driveEff;
        this.calcLenght(this.trip.lenght);
      break;

      case "tripTime":
        if(!this.speedSet){
          this.generalService.showMSG($("#msgErrorSpeed"));
          return;
        }
        this.calcTime(this.trip.tripTime);
  
      break;

      case "lenght":
        if(!this.speedSet){
          this.generalService.showMSG($("#msgErrorTrip"));
          return;
        }
        this.calcLenght(this.trip.lenght);
  
      break;
    }
   this.calcEnergie();
  }

  private calcEnergie(){
    this.trip.energie = this.trip.drivePower * this.trip.tripTime * 0.000000277778;
  }

  private calcSpeed(velocity:number){
    this.trip.velocity = velocity;
    let AirF = 0.5 * this.trip.airDesity * Math.pow(velocity,2) * this.vehicle.area * this.vehicle.cwVal;
    let GndF = this.vehicle.weight * 9.81 * this.vehicle.urVal * this.trip.surface;
    this.trip.driveResistance = AirF + GndF;
    this.trip.wheelPower = this.trip.driveResistance * velocity;   
  }

  private calcForce(force:number){
    let AirF = force - this.calcGndF();
    this.trip.velocity  = Math.sqrt((AirF * 2)/( this.trip.airDesity * this.vehicle.area * this.vehicle.cwVal)) ;
    this.trip.wheelPower = this.trip.driveResistance * this.trip.velocity;  
  }

  private calcGndF(){
    return this.vehicle.weight * 9.81 * this.vehicle.urVal * this.trip.surface;
  }
  
  private calcPower(power:number){
    //GndForce (for Resistance)/ Faktor
    let gndF = this.calcGndF();
    //Air Faktor
    let AirF = 0.5 * this.trip.airDesity * this.vehicle.area * this.vehicle.cwVal;
    //solver
    const nerdamer = require("nerdamer/all.min")
    // equasion for velocity
    var velocity = nerdamer.solve('v*' + gndF + '+' +'v^3*' + AirF +'-'+power, 'v');
    var velocityStr = velocity.text();
    //parse string and convert to km/h
    this.trip.velocity = parseFloat(velocityStr.slice(1, velocityStr.indexOf(",")));
    //Air Force
    AirF = 0.5 * this.trip.airDesity * Math.pow( this.trip.velocity,2) * this.vehicle.area * this.vehicle.cwVal; 
    this.trip.driveResistance = AirF + gndF;
        
  }

  calcMinForceValid(){
    let gndF = this.calcGndF();
    if (this.trip.driveResistance < gndF){
      this.trip.driveResistance = gndF;
    }
    this.form.controls['driveResistance'].setValidators([Validators.required,Validators.min(gndF)]);
  }


  



  private calcLenght(len:number){
    this.trip.lenght = len;
    //in s
    this.trip.tripTime = len / this.trip.velocity * 1000;
  }
  private calcTime(time:number){
    this.trip.tripTime = time;
    this.trip.lenght = this.trip.velocity * time ;
  } 

  update(){ 
    if (!this.completed){
      return
    }
    //submit change to service
    if (!this.form.valid){
    this.generalService.showMSG($("#msgErrorTrip"));
    return;
    }

    this.localService.updateTrip(this.trip);
    this.generalService.showMSG($("#msgUpdateTrip"));
    
    
  }
  

  private save(){
    if(!this.form.controls['velocity'].valid){
      //speed invalid
      this.generalService.showMSG($("#msgErrorSpeed"));
      return;
    }

    if (!this.form.valid){
      //invalid
      this.generalService.showMSG($("#msgErrorTrip"));
      return;
    }

    this.localService.saveTrip(this.trip);
    if (this.completed){
      //Update
      this.generalService.showMSG($("#msgUpdateTrip"));
    } else{
      //Fertig   
      this.generalService.showMSG($("#msgReadyTrip"));
      this.completed = true;
    }
  }

  private formSetter(trip:Trip){
    //nachkomma
    this.form.setValue({
      
      "airDesity":this.decPipe.transform(trip.airDesity,3),
      "surface":this.decPipe.transform(trip.surface,2),
      "velocity":this.decPipe.transform(this.toKMH(trip.velocity),2),
      "driveResistance":this.decPipe.transform(trip.driveResistance,2),
      "wheelPower":this.decPipe.transform(this.formPowerUnit(trip.wheelPower),2),
      "drivePower":this.decPipe.transform(this.formPowerUnit(trip.drivePower),2),
      "tripTime":this.decPipe.transform(this.formTimeUnit(trip.tripTime),2),
      "lenght":this.decPipe.transform(trip.lenght,2),
      "unitWheel":this.powerUnit,
      "unitDrive":this.powerUnit,
      "unitTime":this.timeUnit
    });
  }
  private valueSetter(){
    // write form Values 
       this.trip.airDesity = this.form.controls['airDesity'].value;
       this.trip.surface = this.form.controls['surface'].value;
       this.trip.velocity = this.toMS(this.form.controls['velocity'].value);
       this.trip.driveResistance = this.form.controls['driveResistance'].value;
       this.trip.wheelPower = this.basePowerUnit(this.form.controls['wheelPower'].value);
       this.trip.drivePower = this.basePowerUnit(this.form.controls['drivePower'].value);
       this.trip.tripTime = this.baseTimeUnit(this.form.controls['tripTime'].value);
       this.trip.lenght = this.form.controls['lenght'].value;
  
  }
  
  onSubmit(){
    this.save();
  }
  
  cancel(){
   
    this.generalService.nextTrip();
  }

  public setUnit(event:Event){
    //value auslesen für dyn unit
    let unit = this.form.controls[(event.target as Element).id].value;
    if (unit == this.powerUnit ){
      return;
    }
    this.powerUnit = unit;
    this.formSetter(this.trip);
  }
  
  public setUnitTime(){
    this.timeUnit = this.form.controls["unitTime"].value;
    this.formSetter(this.trip);
  }

  //Unit Conversion
  private baseTimeUnit(time:number){
    
    switch(this.timeUnit){
      case "min":
      time = time * 60;
      break;

      case "Std":
        time = time  * 3600;
      break;
    }
    return time;
  }
  private formTimeUnit(time:number){
    switch(this.timeUnit){
      case "min":
      time = time / 60;
      break;
      case "Std":
        time = time  / 3600;
      break;
    }
    return time;
  }

  private stockPowerUnit(){
    if (this.vehicle.driveTyp == "Motor"){
      this.powerUnit = "Ps";
    }else{
      this.powerUnit = "Watt";
    }
  }
  private basePowerUnit(power:number){
    switch(this.powerUnit){
      case "kW":
      power = power * 1000;
      break;

      case "Ps":
      power = power * 735.49874999999;
      break;
    }
    return power;
  }
  private formPowerUnit(power:number){
    switch(this.powerUnit){
      case "kW":
      power = power / 1000;
      break;

      case "Ps":
      power = power / 735.49874999999;
      break;
    }
    return power;
  }
  private toMS(velocity:number){
    return velocity * (1 / 3.6);
  }
  private toKMH(velocity:number){
    return velocity * 3.6;
  }
 

}
