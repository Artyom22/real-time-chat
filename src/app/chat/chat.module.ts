import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap";

import { chatComponents, ChatRoutingModule } from "./chat-routing.module";

import { UserListComponent } from "./components/user-list/user-list.component";
import { UserListItemComponent } from "./components/user-list/user-list-item/user-list-item.component";
import { ChatFormComponent } from "./components/chat-room/chat-form/chat-form/chat-form.component";
import { LoadSpinnerComponent } from "./components/load-spinner/load-spinner.component";
import { EditFormComponent } from "./components/chat-room/edit-form/edit-form.component";

import { MessagesService } from "../services";

import { ObjectKeysPipe } from "../pipes/object-keys.pipe";
import { DndUploaderDirective } from "../directives/dnd-uploader.directive";
import { InfiniteScrollDirective } from "../directives/infinite-scroll.directive";
import { UserEditFormComponent } from "./components/user-profile/user-edit-form/user-edit-form.component";
import { PasswordEditFormComponent } from "./components/user-profile/password-edit-form/password-edit-form.component";
import { TabsModule } from "ngx-bootstrap";
import { UserGroupsComponent } from './components/user-groups/user-groups.component';
import { GroupEditFormComponent } from './components/user-groups/group-edit-form/group-edit-form.component';
import { CreateChatRoomComponent } from "./components/chat-room/create-chat-room/create-chat-room.component";
import { PushNotificationsComponent } from './components/push-notifications/push-notifications.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
  ],
  declarations: [
    chatComponents,
    UserListComponent,
    UserListItemComponent,
    ChatFormComponent,
    ObjectKeysPipe,
    DndUploaderDirective,
    InfiniteScrollDirective,
    LoadSpinnerComponent,
    CreateChatRoomComponent,
    ChatFormComponent,
    EditFormComponent,
    UserEditFormComponent,
    PasswordEditFormComponent,
    UserGroupsComponent,
    GroupEditFormComponent,
    CreateChatRoomComponent,
    PushNotificationsComponent,
  ],
  providers: [ MessagesService, ],
  entryComponents: [
    UserEditFormComponent,
    PasswordEditFormComponent,
  ],

})
export class ChatModule {
}
