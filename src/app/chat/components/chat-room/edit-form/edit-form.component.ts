import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Message } from "../../../../models";

@Component({
  selector: "app-edit-form",
  templateUrl: "./edit-form.component.html",
  styleUrls: [ "./edit-form.component.scss" ]
})
export class EditFormComponent implements OnInit {
  @Input() msg;
  @Output() editMsg = new EventEmitter<Message>();
  @Output() switchMode = new EventEmitter<boolean>();

  editForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      "text": new FormControl(this.msg.msg.text, [ Validators.required, Validators.minLength(1) ]),
    });
  }

  editTodoItem() {
    this.msg.msg.text = this.editForm.value.text;
    this.editMsg.emit(this.msg);
  }

  cancel() {
    this.switchMode.emit(false);
  }
}
