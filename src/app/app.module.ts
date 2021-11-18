import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import { BoardComponent } from './components/board/board/board.component';
import { AppRoutingModule } from "./app-routing.module";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {FirebaseService} from "./services/firebase.service";
import { StartPageComponent } from './components/start-page/start-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CommonModule} from "@angular/common";
import {BoardService} from "./services/board.service";
import {BoardModule} from "./components/board/board.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DialogModule} from "./components/dialog/dialog.module";

@NgModule({
  declarations: [
    AppComponent,
    // BoardComponent,
    SignInComponent,
    SignUpComponent,
    StartPageComponent,
    // LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    DragDropModule,
    CommonModule,
    BoardModule,
    BrowserAnimationsModule,
    DialogModule
  ],
  providers: [FirebaseService, BoardService],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
