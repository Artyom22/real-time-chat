import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService, MessagesService, UserService } from "../services";
import { User } from "../models";
import { UserListComponent } from "./components/user-list/user-list.component";
import { PushNotificationsComponent } from "./components/push-notifications/push-notifications.component";
import { ChatRoomComponent } from "./components/chat-room/chat-room.component";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: [ "./chat.component.scss" ]
})
export class ChatComponent implements OnInit {
  dgOver = false;
  userDetails: User;
  userStatuses: string[];
  userCurrentStatus: string;
  @ViewChild(UserListComponent) private userListComponent: UserListComponent;
  @ViewChild(ChatRoomComponent) private chatRoomComponent: ChatRoomComponent;
  @ViewChild(PushNotificationsComponent) private pushNotificationsComponent: PushNotificationsComponent;

  constructor(private authService: AuthService,
              private msg: MessagesService,
              private userService: UserService, ) {
  }

  async ngOnInit() {
    this.authService.init();
    await this.userService.init();
    this.userService.startUserTracking();
    this.userService.getUserDetails().then(user => {
      this.userDetails = user.val();
    });
    const statuses = await this.userService.loadUserStatusesList();
    this.userStatuses = statuses.val();
    this.setUserCurrentStatus();
  }

  signOut(): void {
    this.authService.signOut();
  }

  dragOver(isDragged: boolean): void {
    this.dgOver = isDragged;
  }

  onFilesChange(files: File[]) {
    this.dgOver = false;
    this.msg.sendMsg({ attachment: files });
  }

  setUserCurrentStatus() {
    this.userCurrentStatus = this.userService.userStatus;
  }

  async setStatus(status) {
    await this.userService.updateStatus(status);
    this.setUserCurrentStatus();
  }
}
