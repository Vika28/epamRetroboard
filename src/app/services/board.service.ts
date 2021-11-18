import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Card, Column, Comment} from "../components/models/column.model";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private initBoard: Column[] = [];
  // private initBoard = [
  //   {
  //     id: 1,
  //     title: 'To do',
  //     color: '#e92c62',
  //     list:[
  //       {
  //         id: 1,
  //         text: 'example card-item',
  //         like: 1,
  //         comments: [
  //           {
  //             id: 1,
  //             text: 'some comment'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: 'In progress',
  //     color: 'red',
  //     list:[
  //       {
  //         id: 1,
  //         text: 'example card-item',
  //         like: 1,
  //         comments: [
  //           {
  //             id: 1,
  //             text: 'some comment'
  //           },
  //           {
  //             id: 2,
  //             text: 'some comment'
  //           },
  //           {
  //             id: 3,
  //             text: 'some comment'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     title: 'Done',
  //     color: 'blue',
  //     list:[
  //       {
  //         id: 1,
  //         text: 'example card-item',
  //         like: 1,
  //         comments: [
  //           {
  //             id: 1,
  //             text: 'some comment'
  //           }
  //         ]
  //       },
  //       {
  //         id: 2,
  //         text: 'example card-item',
  //         like: 1,
  //         comments: [
  //           {
  //             id: 1,
  //             text: 'some comment'
  //           }
  //         ]
  //       },
  //       {
  //         id: 3,
  //         text: 'example card-item',
  //         like: 1,
  //         comments: [
  //           {
  //             id: 1,
  //             text: 'some comment'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]
  private board: any[] = this.initBoard;
  private board$ = new BehaviorSubject<any[]>(this.initBoard);
  getBoard$(){
    return this.board$.asObservable()
  }
  deleteCard(cardId: number, columnId: number) {
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        column.list = column.list.filter((card: any) => card.id!== cardId);
      }
      return column;
    });
    this.board$.next([...this.board]);
  }
  deleteColumn(columnId:number) {
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
    const newColumn: any = {
      id: Date.now(),
      title: title,
      color: '#009886',
      list: []
    };
    this.board = [...this.board, newColumn];
    this.board$.next([...this.board]);
  }
  changeLike(cardId: number, columnId: number, increase: boolean){
    this.board = this.board.map((column: any) => {
      if(column.id === columnId) {
        const list = column.list.map((card: any) => {
          if(card.id === cardId) {
            if(increase) {
              card.like++;
            } else {
              if(card.like > 0) {
                card.like--;
              }
            }
          }
          return card;
        });
        column.list = list;
        return column;
      } else {
        return column;
      }
    });
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
  constructor() { }
}
