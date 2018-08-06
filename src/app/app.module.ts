import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { ModalModule } from "ngx-bootstrap";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";

import { AuthService } from "./services";
import { AuthGuardService, IsLoggedInAuthPageGuard } from "./guards";
import { MessagesService } from "./services";
import { ChatRoomService } from "./services/chat-room.service";
import { UserService } from "./services/user.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
  ],
  providers: [ AuthGuardService, AuthService, IsLoggedInAuthPageGuard, MessagesService, ChatRoomService, UserService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
