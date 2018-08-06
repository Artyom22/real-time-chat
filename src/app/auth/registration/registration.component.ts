import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AuthService } from "../../services";
import { ValidatorMsgs } from "../../helpers/validator-msgs";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: [ "./registration.component.scss" ],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  name: FormControl;
  surname: FormControl;
  email: FormControl;
  username: FormControl;
  photo: FormControl;
  password: FormControl;
  passwordCf: FormControl;
  passwordGroup: FormGroup;
  photoFile: File;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.createFormControls();
    this.createForm();
  }

  createFormControls(): void {
    this.name = new FormControl("", ValidatorMsgs.required);
    this.surname = new FormControl("", ValidatorMsgs.required);
    this.username = new FormControl("", ValidatorMsgs.required);
    this.photo = new FormControl("");

    this.email = new FormControl("", [
      ValidatorMsgs.required,
      ValidatorMsgs.pattern("[^ @]*@[^ @]*")
    ]);
    this.password = new FormControl("", [
      ValidatorMsgs.minLength(8),
      ValidatorMsgs.required,
    ]);
    this.passwordCf = new FormControl("", [
      ValidatorMsgs.required,
    ]);
  }

  createForm(): void {
    this.registrationForm = new FormGroup({
        name: this.name,
        surname: this.surname,
        username: this.username,
        photo: this.photo,
        email: this.email,
      }
    );

    this.passwordGroup = new FormGroup({
      password: this.password,
      passwordCf: this.passwordCf,
    });

    this.passwordGroup.setValidators(ValidatorMsgs.passwordConfirming(this.password, this.passwordCf));
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.auth.register(this.registrationForm.value, this.photoFile, this.password.value);
    }
  }


  onFileChange(event: Event): void {
    const files = (<HTMLInputElement>event.target).files;
    if (files && files.length) {
      this.photoFile = files[ 0 ];
    }
  }

}
