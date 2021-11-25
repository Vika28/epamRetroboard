import {Component, NgModule, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../../services/board.service";
import {CommonModule} from "@angular/common";
import {FirebaseService} from "../../../services/firebase.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
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
    public firebaseFirestore: AngularFirestore,
    public firebaseAuth: AngularFireAuth
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
      // this.firebaseService.addColumnToFirestore(event);
      this.boardService.addColumn(event);
    }
  }
  onDeleteCard(cardId: number, columnId: number, columnName: string, cardName: string, cardId1: number) {
    this.firebaseService.deleteCardFromColumnFirestore(columnId, cardId1);
    // this.firebaseService.deleteCardFromColumnFirestore(cardId, columnId);
    console.log('event', cardId);
    console.log('cardId', cardId1);
    this.boardService.deleteCard(cardId, columnId);
  }
  onChangeLike(event: {card: any, increase: boolean}, columnId: number) {
    const {card: { id }, increase} = event;
    let userId: any;
    let t;
    this.firebaseService.getCurrentUser()
      .then((res) => {
        userId = res;

        this.firebaseService.changeLikeInCard(id, columnId, userId, (increase: boolean)=> {
          this.boardService.changeLike(id, columnId, increase, userId)
        })
      });
  }
  onAddComment(event: {id: number, text: string}, columnId: number) {
    if(event.text !== ' ') {
      this.boardService.addComment(columnId, event.id, event.text);
    }
  }
  onDeleteComment(comment: any, columnId: number, item: any){
    this.firebaseService.deleteCommentFromFirestore(columnId, item.id, comment.id);
    this.boardService.deleteComment(columnId, item.id, comment.id)
  }
  onDeleteColumn(columnId: number, columnName: string) {
    this.firebaseService.deleteColumnFromFirestore(columnId);
    this.boardService.deleteColumn(columnId);
  }
  onAddCard(cardName: string, columnId: number, columnName: string) {
    console.log('cardName', cardName)
    if(cardName !== undefined) {
      // this.firebaseService.addCardToColumnFirestore(columnName, cardName, columnId);
      console.log('enter')
      this.boardService.addCard(cardName, columnId, columnName);

    }
  }
  onColorChange(color: string, columnId:number) {
    this.firebaseService.updateColumnColorInFirestore(color, columnId);
    this.boardService.changeColumnColor(color, columnId);
  }

  drop(event: CdkDragDrop<string[]>, colId: number) {
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
    let moveditem= JSON.parse(JSON.stringify(event.container.data[event.currentIndex]));
    const previousColumnId = event.previousContainer.element.nativeElement.id;
    const currentColumnId = event.container.element.nativeElement.id;
    this.firebaseService.updateCurrentColumnInFirestore(+currentColumnId, moveditem);
    this.firebaseService.updatePreviousColumnInFirestore(+previousColumnId, moveditem);
    console.log();
    console.log('movedItem', moveditem);
    console.log('previousId', previousColumnId);
    console.log('currentId', currentColumnId);
  }

}


