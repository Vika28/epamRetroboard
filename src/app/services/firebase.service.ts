import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import { map } from "rxjs/operators";

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
  getCollectionFormFirestore(){
  // .pipe(map(res => res.json()));
  //   let items: Array<
  //     {name: string,
  //     allCards: object}
  //     > = [];
  //   this.firebaseFirestore.collection("board")
  //     .get()
  //     .subscribe((ss) => {
  //       ss.docs.forEach((doc) => {
  //         items.push({
  //                       name: doc.id,
  //                       allCards: (doc.data() as {}),
  //                     })
  //       });
  //       console.log('items', items);
  //     });
  //   return items;
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

  getUsername(uid : string) {
    return (this.firebaseFirestore.doc(`board/${uid}`).get())
  }
  async addCardToColumnFirestore(columnName: string, cardName: string, columnId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': number}>;
    await currentColumnRef
      .get()
      .subscribe( {
        next(val) {
          columnCards = val.get('list');
          if(columnCards == undefined) {
            currentColumnRef
              .set({
                  id: columnId,
                  title: columnName,
                  color: 'red',
                  list: [{'id': Date.now(), 'text': cardName, 'like': 0}],
                })
          } else {

            currentColumnRef
              .update({
                list: [...columnCards, {'id': Date.now(), 'text': cardName, 'like': 0}],
              })
          }
          console.log('list', columnCards);
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
  async deleteColumnFromFirestore(columnId: number){
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    await currentColumnRef.delete();
  }
  async deleteCardFromColumnFirestore(columnId: number, cardId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': number}>;
    await currentColumnRef
      .get()
      .subscribe({
        next(val) {
          columnCards = val.get('list');
          columnCards = columnCards.filter((card) => {
            return cardId !== card.id;
          })
          currentColumnRef
            .update({
              list: [...columnCards],
            });
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
  getBoardFromFirestore(){
    let items: Array<
      {id: number,
        title: string,
        list: {},
        color: string}
      > = [];
    this.firebaseFirestore.collection("board")
      .get()
      .subscribe((ss) => {
        let docArr: unknown;

        ss.docs.forEach((doc) => {

          docArr = doc.data();
          items.push({
            id: doc.get('id'),
            title: doc.get('title'),
            list: doc.get('list'),
            color: doc.get('color')
          })
        });
      });
    return items;
  }
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

}
