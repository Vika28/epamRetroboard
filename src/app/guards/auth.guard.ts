import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {FirebaseService} from "../services/firebase.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // constructor(private firebaseService: FirebaseService) { }
  private isSignedIn: boolean | undefined;
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean | UrlTree> {
    let isAuthorized = localStorage.getItem('user') !== null;
    //route to sign in because unAuthorize
    if(isAuthorized){
      this.isSignedIn = true;
    } else {
      this.router.navigate(['sign-in']);
      return false;
    }
    return isAuthorized;
  }

}
