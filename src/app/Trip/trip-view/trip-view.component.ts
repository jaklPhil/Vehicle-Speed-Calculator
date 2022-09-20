import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/shared/local.service';
import { CommaDecPipe } from 'src/app/shared/comma.dec.pipe';
import { GeneralService } from 'src/app/shared/general.service';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.component.html',
  styleUrls: ['./trip-view.component.css']
})
export class TripViewComponent implements OnInit {

  public motor:boolean =false;
  vehicle:any;
  trip:any;
  
  public energieToKm:number = 0;
  public calories1Km:number = 0;
  public fuel100Km:number = 0;
  public toUnit:string=""
  public toLenght:string=""


  constructor(
    private generalService:GeneralService, 
    private localService:LocalService,
  ) { 
    this.calculate(localService);
    //update vehicle
    localService.changeVehicle.subscribe(()=>{
      this.calculate(localService);
    });
    //update trip
    localService.changeTrip.subscribe(()=>{
      this.calculate(localService);
    });
   
  }

  private calculate(service:LocalService){
      this.trip = service.getTrip();
      this.vehicle = service.getVehicle();
      this.motor = this.vehicle.driveTyp == "Motor";
      this.toLenght = this.trip.lenght + "km"
      this.motor?this.toFuel():this.toCalories();
  }
  toCalories() {
    this.toCaloriesKm();
    this.toCalories1Km();
  }

  private toFuel(){
    this.toFuelKm();
    this.toFuel100Km();
  }
  
  private toFuelKm(){
    
    this.vehicle.engine.fuelUsage = this.trip.energie / (this.vehicle.engine.fuelEnergie * this.vehicle.engine.engineEff );
  }

  private toFuel100Km(){
    this.toUnit = "100km"
    this.energieToKm = this.trip.energie * (100/this.trip.lenght)
    this.fuel100Km  = this.energieToKm / (this.vehicle.engine.fuelEnergie * this.vehicle.engine.engineEff );
  }

  private toCaloriesKm(){
    this.vehicle.human.calories = this.trip.energie / this.vehicle.human.muscleEff * 860,421;
  } 

  private toCalories1Km(){
    this.toUnit = "km"
    this.energieToKm = this.trip.energie * (1/this.trip.lenght)
    this.calories1Km = this.energieToKm / this.vehicle.human.muscleEff * 860,421;
  }   
 
  cancel(){
    this.generalService.nextTrip();
    this.trip = this.localService.getTrip();
    
    
    
  }
  ngOnInit() { 
    window.scrollTo(0,document.body.scrollHeight);
  }
  
  scrollToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
  

}
