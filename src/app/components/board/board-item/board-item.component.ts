import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css']
})
export class BoardItemComponent implements OnInit {
  @Input() item: any;
  @Output() emitText: EventEmitter<{id: number; text: string }> = new EventEmitter();
  commentInput = '';
  open = false;
  constructor() { }

  ngOnInit(): void {
  }

  onOpenComment() {
    this.open = !this.open;
  }

  onCommentTextEmmit(id: number) {
    this.emitText.emit({id, text: this.commentInput });
    this.commentInput = '';
  }

}
