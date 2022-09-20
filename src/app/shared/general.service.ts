import { Injectable } from "@angular/core";
import { Router} from "@angular/router";
import { ModalComponent } from "../modal-dialog/modal-dialog.component";
import { LocalService } from "./local.service";


@Injectable()
export class GeneralService {
    constructor(private localService:LocalService, private router:Router, private dialog:ModalComponent){}
    
    showMSG(msg:any){
        msg.clearQueue();
        msg.stop();
        msg.fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      }

    
    nextTrip(){
      if(this.localService.cleard){
        this.router.navigate(["/vehicle"]);
        return;
      }
      let promise = this.dialog.open(
        "Fahrt verwerfen",
        "Soll die aktuelle Fahrt verworfen werden ?",
        "Verwerfen");
      promise.then(accepted =>{
        if(accepted){
          console.log("disabled")
          this.localService.clearTrip()
          this.router.navigate(["/vehicle"]);
        }
      });
    
    }

    cancelAddVehicle(){
      let promise = this.dialog.open(
        "Fahrzeugvorlage verwerfen ?",
        "Soll die aktuelle Fahrzeugvorlage verworfen werden ?",
        "Verwerfen");
      promise.then(accepted =>{
        if(accepted){
          console.log("disabled")
          this.localService.clearTrip()
          this.router.navigate(["/vehicle"]);
        }
      });
    
    }
}