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
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean | UrlTree> {
    const user = await this.afAuth.currentUser;
    const isAuthenticated = user ? true : false;
    //route to sign in because unAuthorize
    if(!isAuthenticated){
      this.router.navigate(['sign-in']);
    }
    return isAuthenticated;
  }

}
