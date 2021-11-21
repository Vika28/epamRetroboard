import {Component, NgModule, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../../services/board.service";
import {CommonModule} from "@angular/common";
import {FirebaseService} from "../../../services/firebase.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
/**
 * @title Drag&Drop connected sorting
 */

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(
    public boardService: BoardService,
    public firebaseService: FirebaseService,
    public firebaseFirestore: AngularFirestore
  ) {
  }

  ngOnInit(): void {
    console.log('onInitWorks');
    let items: Array<
      {id: number,
        title: string,
        list: {},
        color: string}
      > = [];
    items = this.firebaseService.getBoardFromFirestore();
    console.log('items', items);
    this.boardService.generateInitBoard(items);

  }
  addColumn(event: string) {
    if(event){
      this.boardService.addColumn(event);
    }
  }
  onDeleteCard(cardId: number, columnId: number, columnName: string, cardName: string, cardId1: number) {
    this.firebaseService.deleteCardFromColumnFirestore(columnId, cardId1);
    console.log('cardId', cardId);
    this.boardService.deleteCard(cardId1, columnId);
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
    this.firebaseService.deleteColumnFromFirestore(columnId);
    this.boardService.deleteColumn(columnId);
  }
  onAddCard(cardName: string, columnId: number, columnName: string) {
    if(cardName) {
      this.boardService.addCard(cardName, columnId);
      this.firebaseService.addCardToColumnFirestore(columnName, cardName, columnId);
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


