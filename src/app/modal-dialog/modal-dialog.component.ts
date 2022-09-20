
import {Component, EventEmitter, Inject, Injectable, Input, OnInit, Output, Type} from '@angular/core';
import {  NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as angular from "angular";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';


export interface DialogData {
  name: string;
  msg: string;
  acc: string;
}



@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  
})

export class ModalComponent {
  name:string ="";
  msg:string="";
  acc:string="";
 constructor(private modalService: MatDialog) {}
  open(name:string, msg:string, acc:string) {
    this.name = name;
    this.msg = msg;
    this.acc = acc;
    return new Promise<Boolean>(resolve =>{
      let activeModal = this.modalService.open(ModalDialogComponent, {
          data: {name: this.name, msg: this.msg, acc: this.acc}
      });
      activeModal.afterClosed().subscribe(accepted=>{
        console.log(accepted);
        //catch esc key
        if (accepted === undefined){
          resolve(false);
        }
        resolve(accepted);
      });
    });
  }

}
@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})

export class ModalDialogComponent{
  constructor(
  public modal: MatDialogRef<ModalDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    console.log(data);
  }
 
  dismiss(){ 
    this.modal.close(false);
  }
  accept(){
    console.log("diss");
    this.modal.close(true);
  }
}

