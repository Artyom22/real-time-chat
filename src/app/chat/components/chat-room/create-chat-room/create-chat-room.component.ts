import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ChatRoomService } from "../../../../services";

@Component({
  selector: "app-create-chat-room",
  templateUrl: "./create-chat-room.component.html",
  styleUrls: [ "./create-chat-room.component.scss" ]
})
export class CreateChatRoomComponent implements OnInit {
  chatRoomForm: FormGroup;
  name: FormControl;
  password: FormControl;
  @Output() submitted = new EventEmitter();

  constructor(private roomService: ChatRoomService) {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.name = new FormControl("", [
      Validators.required
    ], this.isChatRoomNameUnique.bind(this));
    this.password = new FormControl("", [
      Validators.minLength(8),
      Validators.required
    ]);
  }

  async isChatRoomNameUnique() {
    if (this.name) {
      return await this.roomService.checkNameExisting(this.name.value) ? { notUnique: true } : null;
    }
  }

  createForm(): void {
    this.chatRoomForm = new FormGroup({
      name: this.name,
      password: this.password
    });
  }

  async onSubmit() {
    if (this.chatRoomForm.valid) {
      await this.roomService.createRoom(this.chatRoomForm.value);
      this.submitted.emit();
    }
  }


}
