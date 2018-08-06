import { Component, OnInit, TemplateRef } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";

import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { AngularFireStorage } from "angularfire2/storage";
import { UserEditFormComponent } from "./user-edit-form/user-edit-form.component";
import { PasswordEditFormComponent } from "./password-edit-form/password-edit-form.component";


@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: [ "./user-profile.component.scss" ]
})
export class UserProfileComponent implements OnInit {
  user: User;
  userPhoto;
  photoFile: File;
  bsModalRef: BsModalRef;
  bsModalRefSubmit: BsModalRef;
  withoutPhoto: boolean;
  photoEdit = false;

  constructor(private userService: UserService,
              private modalService: BsModalService,
              private storage: AngularFireStorage,) {
  }


  ngOnInit() {
    this.getUserDetails();
  }


  async getUserDetails() {
    let data = await this.userService.getUserDetails();
    this.user = data.val();
    if (this.user.photo) {
      this.withoutPhoto = false;
      this.userPhoto = await this.storage.storage.ref().child(this.user.photo).getDownloadURL();

    } else {
      this.userPhoto = "../../../../../assets/images/no_image.jpg";
      this.withoutPhoto = true;
    }

  }


  openProfileEditModal() {
    const initialState = {
      user: this.user,
      title: "Edit User Details"
    };
    this.bsModalRef = this.modalService.show(UserEditFormComponent, { initialState });
    this.bsModalRefSubmit = this.modalService.onHide.subscribe(() => {
      this.getUserDetails();
    });
    this.bsModalRef.content.closeBtnName = "Close";

  }


  openPasswordEditModal() {
    const initialState = {
      user: this.user,
      title: "Change Password"
    };
    this.bsModalRef = this.modalService.show(PasswordEditFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = "Close";
  }

  switchPhotoEdit() {
    this.photoFile = null;
    this.photoEdit = !this.photoEdit;
  }

  async savePhoto() {
    if (this.withoutPhoto && this.user.photo) {
      await this.userService.changePhoto();
      await this.getUserDetails();
    } else if (!this.withoutPhoto && this.photoFile) {
      await this.userService.changePhoto(this.photoFile);
      await this.getUserDetails();
    }
    this.photoFile = null;
    this.photoEdit = false;

  }

  onFileChange(event: Event): void {
    const files = (<HTMLInputElement>event.target).files;
    if (files && files.length) {
      this.photoFile = files[ 0 ];
    }
  }
}
