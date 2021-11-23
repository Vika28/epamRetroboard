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
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    await currentColumnRef
      .set({
        id: columnId,
        title: columnName,
        color: '#009886',
        list: []
        // list: {id: 0, text: '', like: [], comments: []}
      })
  }
  async changeLikeInCard(cardId: number, columnId: number, userId: any, func: (val: boolean) => void) {
    console.log('user', userId);
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], comments: []}>;
    let allCards: Array<{'id': number, 'text': string, 'like': [], comments: []}>;
    let currentCard: {'id': number, 'text': string, 'like': [], comments: []};
    let arrWithLikedId: string[];

    await currentColumnRef
      .get()
      .subscribe({
          next(val) {

            columnCards = val.get('list');
            columnCards.forEach((card) => {
              if(cardId === card.id) {
                currentCard = card;
              }
            })
            columnCards = columnCards.filter((card) => {
              return cardId !== card.id;
            })
            arrWithLikedId = currentCard.like;
            if (!arrWithLikedId.includes(userId)) {
              arrWithLikedId.push(userId);
              console.log('not include', arrWithLikedId);
              currentColumnRef
                .update({
                  list: [...columnCards, {'id': cardId, 'text': currentCard.text, 'like': arrWithLikedId, 'comments': currentCard.comments}],
                })
              func(true);

              return 'not';
            } else {
              arrWithLikedId = arrWithLikedId.filter((item) => {
                return item !== userId;
              })
              console.log(' include', arrWithLikedId);
              currentColumnRef
                .update({
                  list: [...columnCards, {'id': currentCard.id, 'text': currentCard.text, 'like': arrWithLikedId, 'comments': currentCard.comments}],
                });
              func(false);
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
  async addCardToColumnFirestore(columnName: string, cardName: string, columnId: number, cardId: number) {
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
                list: [{'id': cardId, 'text': cardName, 'like': [], 'comments': []}],
              })
          } else {

            currentColumnRef
              .update({
                list: [...columnCards, {'id': cardId, 'text': cardName, 'like': [], 'comments': []}],
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
    'id': number, 'text': string, 'like': [], 'comments': []
  }) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    await currentColumnRef
      .get()
      .subscribe( {
          next(val) {
            columnCards = val.get('list');
              currentColumnRef
                .update({
                  // list: [...columnCards],
                  list: [...columnCards, {'id': newCard.id, 'text': newCard.text, 'like': newCard.like, 'comments': newCard.comments}],
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
    'id': number, 'text': string, 'like': [], 'comments': []
  }) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
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
    console.log('cardIdIN', cardId);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    await currentColumnRef
      .get()
      .subscribe({
        next(val) {
          columnCards = val.get('list');
          console.log('columnCards', columnCards);
          columnCards = columnCards.filter((card) => {
            console.log('cardId', cardId);
            console.log('EACHcard.Id', card.id);

            return cardId !== card.id;
          })
          console.log('columnCardsafter', columnCards);

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
        list: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>,
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
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    let allCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    let currentCard: {'id': number, 'text': string, 'like': [], 'comments': []};
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
  async addCommentToFirestore(columnId: number, cardId: number, commenTtext: string, commentId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    let currentCard: {'id': number, 'text': string, 'like': [], 'comments': []};
    let currentCardComment: {'id': number, 'text': string};
    await currentColumnRef
      .get()
      .subscribe( {
          next(val) {
            columnCards = val.get('list');
            columnCards.forEach((card) => {
                if(card.id === cardId) {
                  currentCard = card;
                }
            })
            columnCards = columnCards.filter((card) => {
              return card.id !== cardId
            })

            console.log('currentCard', currentCard)

            if(currentCard.comments === undefined) {
              currentColumnRef
                .update({
                  list: [...columnCards, {'id': currentCard.id, 'text': currentCard.text, 'like': currentCard.like, 'comments': [{'id': commentId, 'text': commenTtext}]}],
                })
            } else {

              currentColumnRef
                .update({
                  list: [...columnCards, {'id': currentCard.id, 'text': currentCard.text, 'like': currentCard.like, 'comments': [...currentCard.comments, {'id': commentId, 'text': commenTtext}]}],
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
  async deleteCommentFromFirestore(columnId: number, cardId: number, commentId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    let currentCard: {'id': number, 'text': string, 'like': [], 'comments': []};
    let currentCardComments: Array<{'id': number, 'text': string}>;
    await currentColumnRef
      .get()
      .subscribe({
          next(val) {
            columnCards = val.get('list');
            columnCards.forEach((card) => {
              if(card.id === cardId) {
                currentCard = card;
              }
            })
            columnCards = columnCards.filter((card) => {
              return cardId !== card.id;
            })
            currentCardComments = currentCard.comments;
            currentCardComments = currentCardComments.filter((comment) => {
              return comment.id !== commentId;
            })
            currentColumnRef
              .update({
                list: [...columnCards, {'id': currentCard.id, 'text': currentCard.text, 'like': currentCard.like, 'comments': [...currentCardComments]}],
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
  async updateColumnColorInFirestore(color: string, columnId: number) {
    let currentColumnRef = this.firebaseFirestore.doc(`board/${columnId}`);
    let columnCards: Array<{'id': number, 'text': string, 'like': [], 'comments': []}>;
    await currentColumnRef
      .get()
      .subscribe( {
          next(val) {
            columnCards = val.get('color');
            currentColumnRef
              .update({
                // list: [...columnCards],
                color: color,
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
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

}
