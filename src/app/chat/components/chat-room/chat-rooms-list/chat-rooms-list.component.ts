import { Component, OnInit, TemplateRef } from "@angular/core";
import { ChatRoomService } from "../../../../services/chat-room.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "app-chat-rooms-list",
  templateUrl: "./chat-rooms-list.component.html",
  styleUrls: [ "./chat-rooms-list.component.scss" ]
})
export class ChatRoomsListComponent implements OnInit {

  chatRooms;
  modalRef: BsModalRef;

  constructor(private roomService: ChatRoomService,
              private modalService: BsModalService) {
  }

  async ngOnInit() {
    const rooms = await this.roomService.loadChatRooms();
    this.chatRooms = rooms.val();
  }

  openRoomCreateMenu(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
