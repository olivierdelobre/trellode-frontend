import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { BoardsComponent } from './components/boards/boards.component';
import { ListComponent } from './components/list/list.component';
import { CardComponent } from './components/card/card.component';
import { CommentComponent } from './components/comment/comment.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CardFormComponent } from './components/card-form/card-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationComponent } from './components/notification/notification.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MiscService } from './services/misc.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import { BroadcastService } from './services/broadcast.service';
import { BoardFormComponent } from './components/board-form/board-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { ChecklistItemComponent } from './components/checklistitem/checklistitem.component';
import { ResponseInterceptor } from './http-interceptors/response-interceptor';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './services/auth.service';
import { RegistrerComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
    declarations: [
        AppComponent,
        BoardsComponent,
        BoardComponent,
        ListComponent,
        CardComponent,
        CommentComponent,
        CardFormComponent,
        BoardFormComponent,
        ChecklistComponent,
        ChecklistItemComponent,
        NotificationComponent,
        NavigationComponent,
        RegistrerComponent,
        LoginComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        TranslateModule.forRoot(),
        QuillModule.forRoot(),
        DragDropModule,
        RouterModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatCheckboxModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    providers: [
        AuthService,
        MiscService,
        BroadcastService,
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: MatSnackBarRef,
            useValue: {}
        }, {
            provide: MAT_SNACK_BAR_DATA,
            useValue: {} // Add any data you wish to test if it is passed/used correctly
        },
        {
            provide: MatDialogRef,
            useValue: {}
        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    ]
})
export class AppModule { }
