import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/auth.service';
import { VehicleListComponent } from './Vehicle/vehicle-list/vehicle-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeedViewComponent } from './Speed/speed-view/speed-view.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations" 
import { VehicleService } from './shared/vehicle.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LocalService } from './shared/local.service';
import { CommaDecPipe } from './shared/comma.dec.pipe';
import { TripViewComponent } from './Trip/trip-view/trip-view.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { GeneralService } from './shared/general.service';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent, ModalComponent } from './modal-dialog/modal-dialog.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';




const appRoutes:Routes =[
  {path: 'vehicle', component: VehicleListComponent,},
  {path: 'edit/:id/:redakteur', component: VehicleEditComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'vehicle',  pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
]

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBS-t8jqeuoP8gtvtAbG1Nn5V3hrqabW3g",
    authDomain: "webprojekt-10cc6.firebaseapp.com",
    projectId: "webprojekt-10cc6",
    storageBucket: "webprojekt-10cc6.appspot.com",
    messagingSenderId: "584168741707",
    appId: "1:584168741707:web:53ceeb54fe0ca0787ea6ce"
  };
 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    LoginComponent,
    SpeedViewComponent,
    VehicleEditComponent,
    VehicleListComponent,
    TripViewComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CommonModule,
    NgbModule,
    MatDialogModule 
  ],
  providers: [AuthService, VehicleService, LocalService, DecimalPipe, CommaDecPipe, GeneralService, NgbActiveModal, ModalComponent ,ModalDialogComponent, {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
