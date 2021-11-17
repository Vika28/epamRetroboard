import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import { NgForm } from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isSignedIn = false;
  isFormInvalid = false;
  isCredentialInvalid = false;

  constructor(public firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') !== null){
      this.isSignedIn = true;
      this.router.navigate(['board']);
    } else {
      this.isSignedIn  = false;
    }
  }

  async onSignIn(email: string, password: string) {
    if(email === '' || password === '') {
      this.isFormInvalid = true;
      this.isCredentialInvalid = false;
      return;
    }
    await this.firebaseService.signIn(email, password);
    console.log('this.firebaseService.isLoggedIn', this.firebaseService.isLoggedIn);

    if(this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      this.router.navigate(['board'])
    } else {
        this.isCredentialInvalid = true;
        this.isFormInvalid = false;
        return;
      // }
    }
    console.log(email, password);
  }

}
