import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

import { UserService, AuthService } from "../../../../services";
import { User } from "../../../../models";

@Component({
  selector: "app-password-edit-form",
  templateUrl: "./password-edit-form.component.html",
  styleUrls: [ "./password-edit-form.component.scss" ]
})
export class PasswordEditFormComponent implements OnInit {
  @Input() user: User;

  passwordEditForm: FormGroup;
  currentPassword: FormControl;
  password: FormControl;
  passwordCf: FormControl;
  passwordGroup: FormGroup;

  constructor(private authService: AuthService,
              private userService: UserService,
              public bsModalRef: BsModalRef,) {
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.currentPassword = new FormControl("", [
      Validators.minLength(8),
      Validators.required,
    ]);
    this.password = new FormControl("", [
      Validators.minLength(8),
      Validators.required,
    ]);
    this.passwordCf = new FormControl("", [
      Validators.required,
    ]);
  }

  createForm(): void {
    this.passwordEditForm = new FormGroup({
        currentPassword: this.currentPassword
      }
    );

    this.passwordGroup = new FormGroup({
      password: this.password,
      passwordCf: this.passwordCf,
    }, this.passwordConfirming.bind(this));
  }

  passwordConfirming() {
    if (this.passwordEditForm) {
      return this.password.value !== this.passwordCf.value ?
        { invalid: true } : null;
    }
  }


  async onSubmit() {
    if (this.passwordEditForm.valid) {
      await  this.userService.editPassword(this.user.email, this.currentPassword.value, this.password.value);
      await this.bsModalRef.hide();
      this.authService.signOut();
    }
  }


}
