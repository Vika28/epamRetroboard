import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(public firebaseService: FirebaseService, private router: Router) { }


  ngOnInit(): void {
  }

  async onLogout() {
    await this.firebaseService.logout();
    await this.router.navigate(['sign-in']);
  }

}
