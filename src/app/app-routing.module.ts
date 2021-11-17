import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {BoardComponent} from "./components/board/board.component";
import {AuthGuard} from "./guards/auth.guard";
import {StartPageComponent} from "./components/start-page/start-page.component";
import {AppComponent} from "./app.component";


const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'board', component: BoardComponent, canActivate:[AuthGuard] }
  // { path: 'board', component: BoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

