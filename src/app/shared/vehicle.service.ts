import { EventEmitter, Injectable, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Vehicle } from "../model/vehicle";
import { Engine } from "../model/engine";
import { Human } from "../model/human";

@Injectable()
export class VehicleService {
    clearTrip() {
        throw new Error("Method not implemented.");
    }
    constructor(
        
        private db:AngularFirestore
        ) { }
    @Output() changed = new EventEmitter();
    object:Vehicle[] = [];
    @Output() isLoaded= new EventEmitter();

    byId(id:string){
        return new Promise<Vehicle>(resolve =>{
            this.db.collection('vehicle').doc(id).get().subscribe(function(doc){
            let data:any = doc.data();
            let obj =new Vehicle(doc.id,data.name, 
                data.typ, 
                data.weight,
                data.passengerWeight,
                data.cwVal,
                data.area,
                data.urVal,
                data.driveTyp,
                data.driveEff,
                new Engine(data.fuel,data.fuelEnergie,data.fuelUsage,data.engineEff), 
                new Human(data.calories,data.muscleEff));
            //let obj = new Person(doc.id, data.firstname, data.lastname, data.email);
            resolve(obj);
        });
    });
      }

    async getAll(){
       
        //console.log("get all");
        let promise = new Promise<Vehicle[]>(resolve => {
        let col = this.db.collection('vehicle');
        col.get().subscribe(function(snapshot){
            let object:Vehicle[] = [];
            snapshot.forEach(function(doc){
   
                
                let data:any = doc.data();
                //set Data according to driveTyp
                let driveTyp = data.driveTyp;
                let engine:Engine;
                let human:Human; 
                switch(driveTyp) {
                    case "Motor":
                      // Engine
                      engine = new Engine(data.fuel,data.fuelEnergi,data.fuelUsage,data.engineEff);
                      human =  new Human(0,0);
                      break;
                    case "Mensch":
                      // Human
                      engine = new Engine("",0,0,0);
                      human =  new Human(data.calories,data.muscleEff);
                      break;
                    default:
                        // Empty
                        engine = new Engine("",0,0,0);
                        human =  new Human(0,0);
                  }
                
                let vehicle = new Vehicle(doc.id,data.name,data.typ,data.weight,data.passengerWeight,data.cwVal,data.area,data.urVal,data.driveTyp,data.driveEff,engine,human);
                let obj = vehicle;
               
                object.push(obj);    
            });
            resolve(object);  
        }); 
        });
        return promise;
    }


      delete(id:string){
        this.db.collection('vehicle').doc(id).delete().then(() => {
            this.changed.emit();
        })
    
      }
      save(obj:Vehicle){
        let col = this.db.collection("vehicle");
        let tmp ={
            "name":obj.name,
            "typ":obj.typ,
            "weight":obj.weight,
            "passengerWeight":obj.passengerWeight,
            "cwVal":obj.cwVal,
            "area":obj.area,
            "urVal":obj.urVal,
            "driveTyp":obj.driveTyp,
            "driveEff":obj.driveEff,
            "calories":obj.human.calories,
            "muscleEff":obj.human.muscleEff,
            "fuel":obj.engine.fuel,
            "fuelEnergie":obj.engine.fuelEnergie,
            "fuelUsage":obj.engine.fuelUsage,
            "engineEff":obj.engine.engineEff
        };
       
        let is_new:boolean;
        is_new = (obj.id.length<2);
        console.log(is_new);
        if (is_new){
            col.add(tmp).then(doc =>{
                obj.id = doc.id;
                this.changed.emit();
            });
        } else {
            console.log(obj.id);
            col.doc(obj.id).set(tmp).then(() => {
                this.changed.emit()
            });
        }
    
      }
}