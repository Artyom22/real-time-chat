import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../../../models";
import { AngularFireStorage } from "angularfire2/storage";

@Component({
  selector: "app-user-list-item",
  templateUrl: "./user-list-item.component.html",
  styleUrls: [ "./user-list-item.component.scss" ]
})
export class UserListItemComponent implements OnInit {
  @Input() user: User;
  userPhoto: string;

  constructor(private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    if (this.user.photo) {
      this.storage.storage.ref().child(this.user.photo).getDownloadURL().then(link => {
        this.userPhoto = link;
      });
    } else {
      this.userPhoto = "../../../../../assets/images/photo_profile2.jpeg";
    }
  }

}
