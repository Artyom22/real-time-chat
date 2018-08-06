import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ChatComponent } from "./chat.component";
import { ChatRoomComponent } from "./components/chat-room/chat-room.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ChatRoomsListComponent } from "./components/chat-room/chat-rooms-list/chat-rooms-list.component";

const routes: Routes = [
  {
    path: "",
    component: ChatComponent,
    children: [
      { path: "", component: ChatRoomsListComponent },
      { path: "chatroom/:id", component: ChatRoomComponent },
      { path : "profile", component: UserProfileComponent },
      { path: "**", redirectTo: "" }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ChatRoutingModule {
}

export const chatComponents = [
  ChatComponent,
  ChatRoomComponent,
  ChatRoomsListComponent,
  UserProfileComponent
];
