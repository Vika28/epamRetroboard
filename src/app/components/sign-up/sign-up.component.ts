import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

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
  async onSignUp(email: string, password: string, userName: string) {
    if(email === '' || password === '' || userName === '') {
      this.isFormInvalid = true;
      this.isCredentialInvalid = false;
      return;
    }
    await this.firebaseService.signUp(email, password, userName);
    if(this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      this.router.navigate(['board']);
    } else {
      this.isCredentialInvalid = true;
      this.isFormInvalid = false;
      return;
      // }
    }
  }
}
