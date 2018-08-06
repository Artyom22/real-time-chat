import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessagesService } from "../../../../../services";

@Component({
  selector: "app-chat-form",
  templateUrl: "./chat-form.component.html",
  styleUrls: [ "./chat-form.component.scss" ]
})
export class ChatFormComponent implements OnInit {
  msgForm: FormGroup;
  msg: FormControl;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.msg = new FormControl("", Validators.required);
  }

  createForm(): void {
    this.msgForm = new FormGroup({
      msg: this.msg
    });
  }

  onFileChange(event): void {
    this.messagesService.sendMsg({ attachment: event.target.files });
  }

  onSubmit(): void {
    if (this.msgForm.valid) {
      const msg = {
        text: this.msg.value
      };
      this.messagesService.sendMsg(msg);
    }
  }

}
