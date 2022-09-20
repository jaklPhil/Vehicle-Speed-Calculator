import { EventEmitter, Injectable, Output } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable()

export class AuthService{
@Output() changed = new EventEmitter();
private current_user:any =null;
user_Name:string ="";

//load fb service
constructor(private service:AngularFireAuth){}

    async login(email:string, password:string){
        //findig person in Person fb service
        try{
            let result = await this.service.signInWithEmailAndPassword(email, password)
            this.current_user = result.user;
            this.user_Name = this.current_user.email;
            this.changed.emit(); 
            return true;
        } catch (error){
            console.log(error);
            return false;
        }
    }

    logout(){
        this.service.signOut();
        this.current_user = null
        this.changed.emit();
        return null;
    }
    isLogginIn(){
        return this.current_user != null;
    }

}