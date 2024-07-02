import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsComponent } from './components/boards/boards.component';
import { BoardComponent } from './components/board/board.component';
import { CardComponent } from './components/card/card.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrerComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
  { path: 'boards', component: BoardsComponent },
  { path: 'boards/:id', component: BoardComponent },
  { path: 'lists/:listId/cards', component: CardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrerComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
