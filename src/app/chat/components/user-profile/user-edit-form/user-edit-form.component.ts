import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { User } from "../../../../models/user";
import { UserService } from "../../../../services";

@Component({
  selector: "app-user-edit-form",
  templateUrl: "./user-edit-form.component.html",
  styleUrls: [ "./user-edit-form.component.scss" ]
})
export class UserEditFormComponent implements OnInit {
  user: User;

  editForm: FormGroup;
  name: FormControl;
  surname: FormControl;
  username: FormControl;


  constructor(private userService: UserService,
              public bsModalRef: BsModalRef,) {
  }


  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }


  createFormControls(): void {
    this.name = new FormControl(this.user.name, Validators.required);
    this.surname = new FormControl(this.user.surname, Validators.required);
    this.username = new FormControl(this.user.username, Validators.required);
  }

  createForm(): void {
    this.editForm = new FormGroup({
        name: this.name,
        surname: this.surname,
        username: this.username,
      }
    );
  }

  async onSubmit() {
    if (this.editForm.valid) {
      await   this.userService.editUserDetails(this.editForm.value);
      await this.bsModalRef.hide();
    }
  }

}
