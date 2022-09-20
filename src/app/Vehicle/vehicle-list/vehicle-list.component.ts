import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/model/vehicle';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/shared/vehicle.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ModalComponent } from 'src/app/modal-dialog/modal-dialog.component';
import { LocalService } from 'src/app/shared/local.service';
@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles:Vehicle[] =[];
  selected:any =  null;
  loggedIn:any = this.auth.isLogginIn();
 
  constructor(
    private router:Router, 
    private service:VehicleService,
    private auth:AuthService,
    private dialog:ModalComponent
    ) { 
    this.loadData();
    this.service.changed.subscribe(() => {
      this.loadData();
      this.selected = null;
    });
    this.auth.changed.subscribe(() => {
      this.loggedIn = this.auth.isLogginIn();
    });
  }
 
  delete(){
    let promise = this.dialog.open(
      "Vorlage Löschen",
      "Soll die Vorlage endgültig gelöscht werden ?",
      "Löschen");
    promise.then(obj =>{
      obj?this.service.delete(this.selected.id):""
    });
  }

  loadData(){
    //then makes async
    let promise = this.service.getAll() 
    promise.then(obj =>{
      this.vehicles = obj;
    });
  }

  onSelect(index: any){
    this.selected = this.vehicles[index];
  }
  edit(){
    this.router.navigate(["edit", this.selected.id, true])

  }
  modify(){
    this.router.navigate(["edit", this.selected.id, false])
  }
  onNew(){
    // passes link with :id =0, edit true
    this.router.navigate(["edit", 0, true]);
  }
  ngOnInit(): void {
  }

}
