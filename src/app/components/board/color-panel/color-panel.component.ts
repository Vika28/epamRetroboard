import { Component, OnInit, Output, EventEmitter } from '@angular/core';

enum colors {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  VIOLET = 'purple',
  YELLOW = 'yellow',
  PINK = 'pink'
}
@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.css']
})
export class ColorPanelComponent implements OnInit {
  @Output() emitColor: EventEmitter<string> = new EventEmitter();


  colorsData = Object.values(colors);
  constructor() { }

  ngOnInit(): void {
  }

  onColorEmit(color: string) {
    this.emitColor.emit(color);
  }

}
