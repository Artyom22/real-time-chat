import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { tap } from "rxjs/operators";
import { Subject } from "rxjs/Subject";

@Injectable({
  providedIn: "root"
})
export class ChatRoomService {

  roomId;
  groupId;
  usersInRoom$ = new Subject();

  constructor(private db: AngularFireDatabase,
              private router: Router,
              private userService: UserService,) {
  }

  async initRoomId(params) {
    await  params.pipe(tap(async (param: any) => {
      this.roomId = param.id;
    })).subscribe();
    let grId = await this.db.database.ref("/chat-rooms/").orderByChild("name").equalTo(this.roomId).once("value");
    this.groupId = [ Object.keys(grId.val())[ 0 ] ];
  }

  async createRoom(data: { name: string, password: string }) {
    try {
      await  this.db.database.ref("/chat-rooms/").push().set({
        name: data.name,
        password: data.password,
        createdBy: this.userService.userId
      });
      this.router.navigate([ "chat/chatroom/", data.name ]);
    } catch (error) {
      console.log(error);
    }
  }

  loadChatRooms() {
    return this.db.database.ref("/chat-rooms/").once("value");
  }

  loadChatUserRooms() {
    return this.db.database.ref("/chat-rooms/").orderByChild("createdBy").equalTo(this.userService.userId).once("value");
  }

  async updateRoom(data) {
    try {
      await  this.db.database.ref("/chat-rooms/" + data.id).set({
        name: data.name,
        password: data.password,
        createdBy: this.userService.userId
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRoom(roomId) {
    try {
      await  this.db.database.ref("/chat-rooms/" + roomId).remove();
      await  this.db.database.ref("/message/" + this.groupId).remove();
    } catch (error) {
      console.log(error);
    }
  }

  async showPasswordForm() {
    const room = await this.getRoomDetails();
    return room.val()[ Object.keys(room.val())[ 0 ] ].createdBy === this.userService.userId;
  }

  async getRoomDetails(name?: string) {
    return await this.db.database.ref("/chat-rooms/").orderByChild("name")
      .equalTo(name || this.roomId).once("value");
  }

  async checkPassword(password: string) {

    const room = await this.getRoomDetails();
    return password === room.val()[ Object.keys(room.val())[ 0 ] ].password;
  }

  async checkNameExisting(name) {
    const room = await this.getRoomDetails(name);
    return !!room.val();
  }

  async updateUserOn(roomId, userId) {
    try {
      await  this.db.database.ref("/chat-rooms/" + roomId).child("users").update({ [userId]: userId });
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserOff(roomId, userId) {
    try {
      await  this.db.database.ref("/chat-rooms/" + roomId).child("users").child(userId).remove();
    } catch (error) {
      console.log(error);
    }
  }

  async usersUpdate() {
    let userId;
    let user;
    await  this.db.database.ref("/chat-rooms/" + this.groupId).child("users").on("child_added", async (users) => {
      userId = users.key;
      user = await  this.db.database.ref("/users/" + userId).once("value");
      this.usersInRoom$.next({ action: "entered", data: user.val(), id: userId });
    });

    await  this.db.database.ref("/chat-rooms/" + this.groupId).child("users").on("child_removed", async (users) => {
      userId = users.key;
      user = await  this.db.database.ref("/users/" + userId).once("value");
      this.usersInRoom$.next({ action: "left", data: user.val(), id: userId });
    });

  }


}
