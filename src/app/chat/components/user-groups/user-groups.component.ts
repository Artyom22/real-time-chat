import { Component, OnInit } from "@angular/core";
import { ChatRoomService } from "../../../services/chat-room.service";

@Component({
  selector: "app-user-groups",
  templateUrl: "./user-groups.component.html",
  styleUrls: [ "./user-groups.component.scss" ]
})
export class UserGroupsComponent implements OnInit {
  groups = [];
  groupEditing = false;
  editId: string;

  constructor(private chatRoomService: ChatRoomService) {
  }

  ngOnInit() {
    this.getGroups();
  }

  getGroups() {
    this.chatRoomService.loadChatUserRooms().then(data => {
      this.groups = [];
      for (let key in data.val()) {
        this.groups.push({
          id: key,
          name: data.val()[ key ].name,
          createdBy: data.val()[ key ].createdBy,
          password: data.val()[ key ].password,

        });
      }
    });
  }

  deleteGroup(groupId) {
    this.chatRoomService.deleteRoom(groupId).then(() => {
      this.getGroups();
    });
  }

  switchMode(groupId) {
    this.groupEditing = !this.groupEditing;
    this.editId = groupId;
  }

  edit(e) {
    this.groupEditing = false;
    this.chatRoomService.updateRoom(e);
  }

  cancel(e) {
    this.groupEditing = false;
  }
}
