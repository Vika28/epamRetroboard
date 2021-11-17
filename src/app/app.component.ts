import {Component, OnInit} from '@angular/core';
import {BoardService} from "./services/board.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'epamRetroboard1';
  isLoggedIn = false;

  constructor() { }

}
