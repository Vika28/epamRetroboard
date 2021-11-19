import {Component, NgModule, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../../services/board.service";
import {CommonModule} from "@angular/common";
import {FirebaseService} from "../../../services/firebase.service";
/**
 * @title Drag&Drop connected sorting
 */
// @NgModule({
//   imports: [ CommonModule ]
// })
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  constructor(
    public boardService: BoardService,
    public firebaseService: FirebaseService
  ) {
  }
  addColumn(event: string) {
    if(event){
      this.boardService.addColumn(event);
    }
  }
  onDeleteCard(cardId: number, columnId: number, columnName: string, cardName: string) {
    this.firebaseService.deleteCardFromColumnFirestore(columnName, cardName);
    console.log('cardName', cardName);
    this.boardService.deleteCard(cardId, columnId);
  }
  onChangeLike(event: {card: any, increase: boolean}, columnId: number) {
    const {card: { id }, increase} = event;
    this.boardService.changeLike(id, columnId, increase)
  }
  onAddComment(event: {id: number, text: string}, columnId: number) {
    this.boardService.addComment(columnId, event.id, event.text);
  }
  onDeleteComment(comment: any, columnId: number, item: any){
    this.boardService.deleteComment(columnId, item.id, comment.id)
  }
  onDeleteColumn(columnId: number, columnName: string) {
    this.firebaseService.deleteColumnFromFirestore(columnName);
    this.boardService.deleteColumn(columnId);
  }
  onAddCard(cardName: string, columnId: number, columnName: string) {
    if(cardName) {
      this.boardService.addCard(cardName, columnId);
      this.firebaseService.addCardToColumnFirestore(columnName, cardName);
    }
  }
  onColorChange(color: string, columnId:number) {
    this.boardService.changeColumnColor(color, columnId);
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}


