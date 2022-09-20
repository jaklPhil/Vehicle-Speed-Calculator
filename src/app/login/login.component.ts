import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_failed:boolean = false;
//passes email via #email from html
  @ViewChild('email')
  emailElement!: ElementRef;
  @ViewChild('password')
  passwordElement!: ElementRef;
  
  constructor(private service:AuthService, private router:Router) {
    this.service.logout();
      this.router.navigate(["/login"]);
   }

  ngOnInit(): void {
  }


  async submitLogin(){
    //get data from elements
    let email = this.emailElement.nativeElement.value;
    let password = this.passwordElement.nativeElement.value;
    let result = await this.service.login(email, password)
    if (result) {
      //Login erfolgreich
      this.router.navigate(["/vehicle"]);
    }else{
      this.login_failed = true;
      //error
    }
  }

}
