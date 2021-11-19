import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentSnapshot
} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false;
  constructor(public firebaseAuth: AngularFireAuth, public firebaseFirestore: AngularFirestore) {
  }
  async signIn(email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      })
      .catch(err => {
        console.log(err);
        this.isLoggedIn = false;
      })
  }
  async signUp(email: string, password: string, userName: string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email,password)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
        if(res.user){
          res.user.updateProfile({
            displayName: userName// some displayName,
        })
        }
      })
      .catch(err => {
        console.log(err);
        this.isLoggedIn = false;
      })
  }

  async addColumnToFirestore(columnName: string) {
    console.log('firebase servie work');
    // await this.firebaseFirestore.collection(`board`).doc(`${columnName}`);
    // try {
    //   const docRef = await addDoc(collection( "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  }
  getUsername(uid : string) {
    return (this.firebaseFirestore.doc(`board/${uid}`).get())
  }
  async addCardToColumnFirestore(columnName: string, cardName: string) {
    // await this.firebaseFirestore.collection(`board`).doc(`${columnName}`).set({
    //   allCards: [{'cardName': cardName, 'id': Date.now()}],
    // });
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnName}`);
    let columnCards: Array<{'cardName': string, 'id': number}>;
    await currentColumnRef
      .get()
      .subscribe( {
        next(val) {
          columnCards = val.get('allCards');
          if(columnCards == undefined) {
            currentColumnRef
              .set({
                  allCards: [{'cardName': cardName, 'id': Date.now()}],
                })
          } else {
            currentColumnRef
              .update({
                allCards: [...columnCards, {'cardName': cardName, 'id': Date.now()}],
              })
          }
          console.log('allCards', columnCards);
          },
        error(err) {
          console.error('something wrong occurred: ' + err);
          },
        complete() {
          console.log('done');
        }
      }
      );
  }
  // async getUser() {
  //   const user = await this.firebaseAuth.currentUser;
  //   const isAuthenticated = user ? true : false;
  //
  //   return isAuthenticated;
  // }
    logout() {
      this.firebaseAuth.signOut();
      localStorage.removeItem('user');
    }

}
