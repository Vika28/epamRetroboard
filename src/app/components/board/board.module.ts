import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {LogoutComponent} from "../logout/logout.component";
import { BoardItemComponent } from './board-item/board-item.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {FormsModule} from "@angular/forms";
import { CommentItemComponent } from './comment-item/comment-item.component';
import {DialogModule} from "../dialog/dialog.module";
import { ColorPanelComponent } from './color-panel/color-panel.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    LogoutComponent,
    BoardComponent,
    BoardItemComponent,
    CommentItemComponent,
    ColorPanelComponent,
  ],
    imports: [
        CommonModule,
        DragDropModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        DragDropModule,
        MatExpansionModule,
        FormsModule,
        DialogModule,
        MatDialogModule
    ],
  exports: [
    BoardComponent
  ]
})
export class BoardModule { }
