import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireStorage } from "angularfire2/storage";

import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";

@Injectable()
export class UserService {

  userId: string;
  users$ = new Subject();
  userStatus: string;
  idleTime = 0;

  constructor(private db: AngularFireDatabase,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage) {
    this.auth.authState.pipe(tap(user => {
      if (user) {
        this.userId = user.uid;
      }

    })).subscribe();
  }

  async init() {
    this.getOnlineUsers();
    this.loadUserStatus().on("value", (v) => {
      this.userStatus = v.val();
      this.updateOnConnect();
      this.updateOnDisconnect();
    });
  }

  startUserTracking() {
    setInterval(this.idleTimeIncrement, 60000);
    this.trackUserActivity();
  }

  idleTimeIncrement = () => {
    if (this.userStatus === "online") {
      this.idleTime++;
      if (this.idleTime > 9) {
        this.updateStatus("offline");
      }
    }
  };

  trackUserActivity() {
    addEventListener("mousemove", this.resetIdleTimer);
    addEventListener("mousedown", this.resetIdleTimer);
    addEventListener("keypress", this.resetIdleTimer);
  }

  resetIdleTimer = () => {
    if (this.idleTime > 9) {
      this.updateStatus("online");
    }
    this.idleTime = 0;
  };

  getOnlineUsers(): void {
    this.db.database.ref("/users/").on("value", (user) => {
      if (user) {
        this.db.database.ref("/users/").orderByChild("isOnline").equalTo(true).once("value").then((snapshot) => {
          this.users$.next(snapshot.val());
        });
      }
    });
  }

  async getUserDetails() {
    return await this.db.database.ref("/users/" + this.userId).once("value");
  }

  editUserDetails(user) {
    this.db.database.ref("/users/" + this.userId).update(user);
  }

  async changePhoto(photoFile?) {
    if (photoFile) {
      await this.storage.storage.ref().child("images/" + this.userId).put(photoFile);
    }
    const photo = photoFile ? "images/" + this.userId : null;
    await this.db.database.ref("/users/" + this.userId).update({ photo: photo });
  }

  async editPassword(email, currentPassword, newPassword) {
    let user = this.auth.auth.currentUser;
    await user.updatePassword(newPassword);
  }

  loadUserStatus() {
    return this.db.database.ref("/users/" + this.userId + "/status");
  }

  async loadUserStatusesList() {
    return await this.db.database.ref("user-statuses").once("value");
  }

  public updateOnConnect(): Subscription {
    if (this.userStatus !== "offline") {
      return this.db.object(".info/connected").valueChanges().pipe(tap(() => {
        this.updateStatus(this.userStatus);
      }))
        .subscribe();
    } else {
      this.updateStatus(this.userStatus);
    }
  }

  async updateStatus(status: string) {
    if (this.userId) {
      await this.db.object(`users/` + this.userId).update({ status: status, isOnline: status !== "offline" });
    }
  }

  public updateOnDisconnect(): void {
    this.db.database.ref().child(`users/${this.userId}`)
      .onDisconnect()
      .update({ isOnline: false });
  }

  async userStatusToggle(status) {
    await this.db.object(`users/` + this.userId).update({ isOnline: status });
  }
}
