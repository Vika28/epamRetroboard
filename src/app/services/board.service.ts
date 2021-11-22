import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Card, Column, Comment } from "../components/models/column.model";
import { FirebaseService } from "./firebase.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class BoardService implements OnInit {
  constructor(private firebaseService: FirebaseService,
              public firebaseFirestore: AngularFirestore
              ) { }
  private initBoard: Column[] = [];
  private board: any[] = this.initBoard;
  private board$ = new BehaviorSubject<any[]>(this.initBoard);
  ngOnInit(): void {

  }
  generateInitBoard( boardArg: any ) {
    this.initBoard = boardArg;
    this.board = this.initBoard;
    this.board$ = new BehaviorSubject<any[]>(this.initBoard);
    console.log('generate init board works');
  }

  getBoard$(){
    return this.board$.asObservable()
  }
  deleteCard(cardId: number, columnId: number) {
    this.board = this.board.map((column: any) => {
      console.log('columnId', columnId, 'column.id', column.id)
      if(column.id === columnId) {
        column.list = column.list.filter((card: any) => card.id !== cardId);
      }
      return column;
    });
    this.board$.next([...this.board]);
  }
  deleteColumn(columnId: number) {
    this.board = this.board.filter((column: any) => column.id !== columnId);
    this.board$.next([...this.board]);
  }
  addCard(text: string, columnId: number) {
    const newCard: any = {
      id: Date.now(),
      text,
      like: 0,
      comments: [],
    };
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        column.list = [newCard, ...column.list];
      }
      return column;
    });
    this.board$.next([...this.board]);
  }
  addColumn(title: string) {
    const id = Date.now();
    this.firebaseService.addColumnToFirestore(title, id);
    const newColumn: any = {
      id: id,
      title: title,
      color: '#009886',
      list: []
    };
    this.board = [...this.board, newColumn];
    this.board$.next([...this.board]);
  }
  changeLike(cardId: number, columnId: number, increase: boolean, userId: any){
    // this.board = this.board.map((column: any) => {
    //   if(column.id === columnId) {
    //     const list = column.list.map((card: any) => {
    //       if(card.id === cardId) {
    //         card.like = userId;
    //         // if(increase) {
    //         //   card.like++;
    //         // } else {
    //         //   // if(card.like > 0) {
    //         //   //   card.like--;
    //         //   // }
    //         // }
    //       }
    //       return card;
    //     });
    //     column.list = list;
    //     return column;
    //   } else {
    //     return column;
    //   }
    // });

    // this.board = this.board.map((column: any) => {
    //   if(column.id === columnId) {
    //     const list = column.list.map((card: any) => {
    //       if(card.id === cardId) {
    //
    //       }
    //       return card;
    //     });
    //     column.list = list;
    //     return column;
    //   } else {
    //     return column;
    //   }
    // });

    this.board$.next([...this.board]);
  }
  addComment(columnId: number, cardId: number, text: string) {
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        const list = column.list.map((card: any) => {
          if(card.id === cardId) {
            const newComment = {
              id: Date.now(),
              text,
            };
            card.comments = [newComment, ...card.comments];
          }
          return card;
        });
        column.list = list;
      }
      return column;
    });
    this.board$.next([...this.board]);
  }
  deleteComment(columnId: number, itemId: number, commentId: number) {
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        const list = column.list.map((item: any) => {
          if(item.id === itemId){
            item.comments = item.comments.filter((comment: Comment ) => {
              return comment.id !== commentId;
            })
          }
          return item;
        })
        column.list = list
      }
      return column;
    })
    this.board$.next([...this.board])
  }
  changeColumnColor(color: string, columnId: number) {
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        column.color = color;
      }
      return column;
    });
    this.board$.next([...this.board]);
  }


}
