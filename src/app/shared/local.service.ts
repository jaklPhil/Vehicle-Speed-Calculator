import { EventEmitter } from "@angular/core";
import { Engine } from "../model/engine";
import { Human } from "../model/human";
import { Trip } from "../model/trip";
import { Vehicle } from "../model/vehicle";



export class LocalService{
    
    changeVehicle = new EventEmitter();
    changeTrip = new EventEmitter();
    public vehicle:Vehicle= new Vehicle("q","","",0,0,0,0,0,"",0,new Engine("",0,0,0), new Human(0,0));
    public trip:Trip= new Trip(1.225,1,0,0,0,0,0,5,0);
    public cleard:boolean = true;
    
    saveTrip(obj:Trip){
        console.log("this.trip save")
        this.trip = obj;
        this.cleard = false;
        this.changeTrip.emit();
    }
    clearTrip(){
        this.trip = new Trip(1.225,1,0,0,0,0,0,5,0);
        this.cleard = true;
        this.changeTrip.emit(); 
    }

    updateTrip(obj:Trip){
        this.trip = obj;
        this.cleard = false;
        this.changeTrip.emit(); 
    }

    getTrip(){
        return this.trip
    }

    saveVehicle(obj:Vehicle){
        this.cleard = false;
        this.vehicle = obj;
        this.changeVehicle.emit();
    }
    
    getVehicle(){
        return this.vehicle
    }
}