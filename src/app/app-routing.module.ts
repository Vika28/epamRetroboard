import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {BoardComponent} from "./components/board/board/board.component";
import {AuthGuard} from "./guards/auth.guard";
import {StartPageComponent} from "./components/start-page/start-page.component";
import {AppComponent} from "./app.component";
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import {StartPageGuardGuard} from "./guards/start-page-guard.guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['board']);
const routes: Routes = [
  { path: '',
    component: StartPageComponent,
    canActivate: [StartPageGuardGuard],
    data: { authGuardPipe: redirectLoggedInToSendEmail }},
    // data: { authGuardPipe: redirectLoggedInToSendEmail }},

  { path: 'sign-in',
    component: SignInComponent,
    data: { authGuardPipe: redirectLoggedInToSendEmail }},

  { path: 'sign-up',
    component: SignUpComponent,
    data: { authGuardPipe: redirectLoggedInToSendEmail }},

  { path: 'board',
    component: BoardComponent,
    canActivate: [AuthGuard] }
  // { path: 'board', component: BoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

