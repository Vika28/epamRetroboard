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

  async addColumnToFirestore(columnName: string, columnId:number) {
    // const columnId = Date.now();
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': number}>;
    await currentColumnRef
      .set({
        id: columnId,
        title: columnName,
        color: 'red',
        list: [],
      })
  }
  changeLikeInCard(cardId: number, columnId: number, userId: any) {
    console.log('user', userId);
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': []}>;
    let allCards: Array<{'id': number, 'text': string, 'like': []}>;
    let currentCard: {'id': number, 'text': string, 'like': []};
    let arrWithLikedId: string[];

    currentColumnRef
      .get()
      .subscribe({
          next(val) {

            columnCards = val.get('list');
            allCards = val.get('list');
            columnCards = columnCards.filter((card) => {
              return cardId !== card.id;
            })
            allCards = allCards.filter((card) => {
              return cardId === card.id;
            })
            currentCard = allCards[0];
            arrWithLikedId = currentCard.like;

            if (!arrWithLikedId.includes(userId)) {
              arrWithLikedId.push(userId);
              console.log('not include', arrWithLikedId);
              currentColumnRef
                .update({
                  list: [...columnCards, {'id': cardId, 'text': currentCard.text, 'like': arrWithLikedId}],
                })
              return 'not';
            } else {
              arrWithLikedId = arrWithLikedId.filter((item) => {
                return item !== userId;
              })
              console.log(' include', arrWithLikedId);
              currentColumnRef
                .update({
                  list: [...columnCards, {'id': currentCard.id, 'text': currentCard.text, 'like': arrWithLikedId}],
                });
              return 'yes';
            }
            // console.log('list', columnCards);
          },
          error(err) {
            console.error('something wrong occurred: ' + err);
          },
          complete() {
            console.log('done');
          }
        });
    // return rrr;

  }
  async addCardToColumnFirestore(columnName: string, cardName: string, columnId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': []}>;
    await currentColumnRef
      .get()
      .subscribe( {
        next(val) {
          columnCards = val.get('list');
          if(columnCards === undefined) {
            currentColumnRef
              .update({
                list: [{'id': Date.now(), 'text': cardName, 'like': []}],
              })
          } else {

            currentColumnRef
              .update({
                list: [...columnCards, {'id': Date.now(), 'text': cardName, 'like': []}],
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
  async updateCurrentColumnInFirestore(columnId: number, newCard: {
    'id': number, 'text': string, 'like': []
  }) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': []}>;
    await currentColumnRef
      .get()
      .subscribe( {
          next(val) {
            columnCards = val.get('list');
            // columnCards = columnCards.filter((card) => {
            //   return card.id !== newCard.id
            // })
              currentColumnRef
                .update({
                  // list: [...columnCards],
                  list: [...columnCards, {'id': newCard.id, 'text': newCard.text, 'like': newCard.like}],
                })

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
  async updatePreviousColumnInFirestore(columnId: number, newCard: {
    'id': number, 'text': string, 'like': []
  }) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': []}>;
    await currentColumnRef
      .get()
      .subscribe( {
          next(val) {
            columnCards = val.get('list');
            columnCards = columnCards.filter((card) => {
              return card.id !== newCard.id
            })
            currentColumnRef
              .update({
                list: [...columnCards],
                // list: [...columnCards, {'id': newCard.id, 'text': newCard.text, 'like': newCard.like}],
              })

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

  async getCurrentUser(){
    let userId;
    await this.firebaseAuth.currentUser
      .then((res) => {
        userId = res?.uid;
        console.log(res?.uid);
      })
    return userId;
  }
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

  getBoardFromFirestore1(cardId: number, columnId: number){
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': []}>;
    let allCards: Array<{'id': number, 'text': string, 'like': []}>;
    let currentCard: {'id': number, 'text': string, 'like': []};
    let arrWithLikedId: string[];
    this.firebaseFirestore.doc(`board/${columnId}`)
      .get()
      .subscribe((val) => {

        columnCards = val.get('list');
        allCards = val.get('list');
        columnCards = columnCards.filter((card) => {
          return cardId !== card.id;
        })
        allCards = allCards.filter((card) => {
          return cardId === card.id;
        })
        currentCard = allCards[0];
        arrWithLikedId = currentCard.like;
      });
    // @ts-ignore
    return arrWithLikedId;
  }
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

}
