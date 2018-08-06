import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-group-edit-form",
  templateUrl: "./group-edit-form.component.html",
  styleUrls: [ "./group-edit-form.component.scss" ]
})
export class GroupEditFormComponent implements OnInit {
  @Input() groupDetails;
  @Output() editGroup = new EventEmitter<any>();
  @Output() switchMode = new EventEmitter<boolean>();

  editForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      "name": new FormControl(this.groupDetails.name, [ Validators.required, Validators.minLength(3) ]),
      "password": new FormControl(this.groupDetails.password, [ Validators.required, Validators.minLength(4) ]),
    });
  }

  editGroupDetails() {
    this.groupDetails.name = this.editForm.value.name;
    this.groupDetails.password = this.editForm.value.password;
    this.editGroup.emit(this.groupDetails);
  }

  cancel() {
    this.switchMode.emit(false);
  }
}
