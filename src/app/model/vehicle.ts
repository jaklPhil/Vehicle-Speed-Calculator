import { Engine } from "./engine";
import { Human } from "./human";

export class Vehicle{
    constructor(
        public id:string,
        public name:string,
        public typ:string,
        public weight:number,
        public passengerWeight:number,
        public cwVal:number,
        public area:number,
        public urVal:number,
        public driveTyp:string,
        //efficiency 
        public driveEff:number,
        public engine:Engine,
        public human:Human,
    ){};

        newVehicle(){
            let vehicle = new Vehicle("q","","",0,0,0,0,0,"",0,new Engine("",0,0,0), new Human(0,0));
            return vehicle;
        }
}