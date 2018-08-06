import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { User } from "../../../models";
import { UserService } from "../../../services";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: [ "./user-list.component.scss" ]
})
export class UserListComponent implements OnInit {
  users: Array<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.users$.subscribe((users: User[]) => {
      this.users = users;

      if (this.users && this.userService.userId) {
        delete this.users[ this.userService.userId ];
      }
    });
  }



}
