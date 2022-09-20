import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';
import { GeneralService } from '../shared/general.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn:boolean=this.auth.isLogginIn();
  public navTitel:string ="Speed Calculator";
  constructor(private auth:AuthService,private router:Router,private generalService:GeneralService) {
    this.loggedIn = this.auth.isLogginIn();
    this.auth.changed.subscribe(() => {
        this.loggedIn = this.auth.isLogginIn();
        if(this.loggedIn){
          this.navTitel="Speed Calculator (Redakteur)";
        }else{
          this.navTitel="Speed Calculator";
        } 
    });
   }

  logout(){
    this.auth.logout();
    this.generalService.nextTrip();
  }

  next(){
    this.generalService.nextTrip();
  }

  ngOnInit(): void {
    
  }

}
