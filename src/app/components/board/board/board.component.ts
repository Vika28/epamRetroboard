import {Component, NgModule, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../../services/board.service";
import {CommonModule} from "@angular/common";
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
    public boardService: BoardService
  ) {
  }
  onAddComment(event: {id: number, text: string}, columnId: number) {
    this.boardService.addComment(columnId, event.id, event.text);
  }
  onDeleteComment(comment: any, columnId: number, item: any){
    this.boardService.deleteComment(columnId, item.id, comment.id)
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


