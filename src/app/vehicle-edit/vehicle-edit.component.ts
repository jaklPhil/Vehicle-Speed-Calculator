
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Engine } from '../model/engine';
import { Human } from '../model/human';
import { Vehicle } from '../model/vehicle';
import { LocalService } from '../shared/local.service';
import { CommaDecPipe } from '../shared/comma.dec.pipe';
import { VehicleService } from '../shared/vehicle.service';
import * as $ from "jquery";
import { AuthService } from '../shared/auth.service';
import { GeneralService } from '../shared/general.service';


@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
   
  form:FormGroup;
  public vehicle:any = null;
  public motor:boolean =false;
  public completed:boolean =false;

  private loggedIn:boolean =false;
  
  public redakteurView:boolean =false;
  
  
  constructor(private route:ActivatedRoute, 
    private router:Router,
    private generalService:GeneralService,
    private vehicleService:VehicleService,
    private localService:LocalService,
    private auth:AuthService,
    private decPipe: CommaDecPipe
    ) { 

     
      //Form 
    this.form = new FormGroup({
      typ: new FormControl({value:"", disabled: false},[Validators.required]),
      name: new FormControl("",[Validators.required, Validators.minLength(3)]),
      weight: new FormControl("",[Validators.required, Validators.min(0)]),
      passengerWeight: new FormControl("",[Validators.required, Validators.min(0)]),
      area: new FormControl("",[Validators.required, Validators.min(0)]),
      cwVal: new FormControl("",[Validators.required, Validators.min(0), Validators.max(1)]),
      urVal: new FormControl("",[Validators.required, Validators.min(0), Validators.max(1)]),
      driveEff: new FormControl("",[Validators.required,Validators.min(0), Validators.max(100)]),
      driveTyp: new FormControl("",[Validators.required]),
      muscleEff: new FormControl("",[Validators.required]),
      engineEff: new FormControl("",[Validators.required]),
      fuelEnergie: new FormControl("",[Validators.required]),
      fuel: new FormControl("",[Validators.required])
    });


    

    //set page sate Redakteur
    let id = this.route.snapshot.params["id"];
    let edit = this.route.snapshot.params["redakteur"] == "true";
    this.loggedIn = this.auth.isLogginIn();
    if (!this.redakteurView){
      this.redakteurView = edit && this.loggedIn;
    }
    //Load Form
    this.vehicle = new Vehicle("q","","",0,0,0,0,0,"",0,new Engine("",0,0,0), new Human(0,0));
    if (id != 0){
     //fahrzeuge fom Service laden und in Form einfügen
      this.vehicleService.byId(id).then(obj =>{
      this.vehicle = obj;
      this.formSetter();
      this.setPicture(this.vehicle.typ.toLowerCase());
      this.setValidation();
      this.form.controls.markAllAsTouched;
      }); 
    }
  }
 

  onSubmit(){
  
    this.save();
    
  }
  
  update(){
  this.valueSetter();
  if (this.redakteurView){ 
    return;
  }
  if (this.completed){
    //submit change to service
    if (!this.form.valid){
      this.generalService.showMSG($("#msgError"));
      return;
    }
    this.localService.saveVehicle(this.vehicle);
    this.generalService.showMSG($("#msgUpdate")); 
  }
  }
  save(){
    this.setValidation();
    if (!this.form.valid){
      this.generalService.showMSG($("#msgError"));
      return;
    }
    

    this.valueSetter();
    if (this.redakteurView ){
      console.log("save called");
      this.vehicleService.save(this.vehicle);
      this.router.navigate(["/vehicle"]);
    }else{
      //save in local service in object
      this.localService.saveVehicle(this.vehicle);
      //Load nex component / scroll
      if (this.completed){
        this.generalService.showMSG($("#msgUpdate"));
      } else{
        this.generalService.showMSG($("#msgReady"));
        this.completed = true;
      }
    }
  }
 
  setTyp(){
    this.valueSetter();
    this.motor = this.vehicle.typ != "Fahrrad"
    this.motor?this.vehicle.driveTyp = "Motor":this.vehicle.driveTyp = "Mensch";
    this.setPicture(this.vehicle.typ.toLowerCase());
    this.formSetter();
    this.generalService.showMSG($("#msgAntrieb"));
  }
  
  setValidation(){
    this.valueSetter();
    this.motor = this.vehicle.driveTyp == "Motor";
    if(this.motor){
      //Validation Motor
      this.form.controls['muscleEff'].clearValidators();
      this.form.controls['engineEff'].setValidators([Validators.required,Validators.min(0),Validators.max(100)]);
      this.form.controls['fuelEnergie'].setValidators([Validators.required,Validators.min(0)]);
      this.form.controls['fuel'].setValidators([Validators.required,Validators.minLength(3)]);

    } else{
      //Validation Mensch
      this.form.controls['driveTyp'].setValidators([Validators.required,Validators.min(0),Validators.max(100)]);
      this.form.controls['engineEff'].clearValidators();
      this.form.controls['fuelEnergie'].clearValidators();
      this.form.controls['fuel'].clearValidators();
 
    }
    //Update Validation
    this.form.controls['muscleEff'].updateValueAndValidity();
    this.form.controls['engineEff'].updateValueAndValidity();
    this.form.controls['fuelEnergie'].updateValueAndValidity();
    this.form.controls['fuel'].updateValueAndValidity();

    this.formSetter();
  }

  setPicture(name:string){
    $("#pic").attr("src", './assets/' + name + '.png');
  }

  cancel(){
    if(this.redakteurView){
      this.generalService.cancelAddVehicle();
    }else{
      this.generalService.nextTrip();
    }
    
  }
  private valueSetter(){
    this.vehicle.name = this.form.controls["name"].value;
    this.vehicle.typ = this.form.controls["typ"].value;
    this.vehicle.weight = this.form.controls["weight"].value;
    this.vehicle.passengerWeight = this.form.controls["passengerWeight"].value;
    this.vehicle.cwVal = this.form.controls["cwVal"].value ;
    this.vehicle.area = this.form.controls["area"].value;
    this.vehicle.urVal = this.form.controls["urVal"].value;
    this.vehicle.driveTyp = this.form.controls["driveTyp"].value;
    this.vehicle.driveEff = this.form.controls["driveEff"].value / 100;
    this.vehicle.human.muscleEff = this.form.controls["muscleEff"].value / 100;
    this.vehicle.engine.engineEff = this.form.controls["engineEff"].value / 100;
    this.vehicle.engine.fuelEnergie = this.form.controls["fuelEnergie"].value;
    this.vehicle.engine.fuel = this.form.controls["fuel"].value;
  }

  private formSetter(){
    this.form.setValue({ 
        "name":this.vehicle.name,
        "typ" :this.vehicle.typ,
        "weight": this.decPipe.transform(this.vehicle.weight,2),
        "passengerWeight": this.decPipe.transform(this.vehicle.passengerWeight,2),
        "cwVal":this.decPipe.transform(this.vehicle.cwVal,3),
        "area":this.decPipe.transform(this.vehicle.area,3),
        "urVal":this.decPipe.transform(this.vehicle.urVal,3),
        "driveTyp":this.vehicle.driveTyp,
        "driveEff":this.decPipe.transform(this.vehicle.driveEff * 100,2),
        "muscleEff":this.decPipe.transform(this.vehicle.human.muscleEff * 100,2),
        "engineEff":this.decPipe.transform(this.vehicle.engine.engineEff * 100,2),
        "fuelEnergie":this.decPipe.transform(this.vehicle.engine.fuelEnergie,2),
        "fuel":this.vehicle.engine.fuel
    });
  }
  ngOnInit(): void {

  }
 

}
