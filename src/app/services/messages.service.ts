import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Subject } from "rxjs/Subject";
import { AngularFireStorage } from "angularfire2/storage";
import { tap } from "rxjs/operators";
import { Message } from "../models";
import { ChatRoomService } from "./chat-room.service";

@Injectable()
export class MessagesService {
  userId: string;
  messages$ = new Subject();
  isFileUploaded$ = new Subject();
  msgsLimit = 13;

  constructor(private db: AngularFireDatabase,
              private auth: AngularFireAuth,
              private storage: AngularFireStorage,
              private roomService: ChatRoomService) {
    this.auth.authState.pipe(tap(user => {
      if (user) {
        this.userId = user.uid;
      }
    })).subscribe();
  }


  async loadMessages(startAfter?) {
    const refQ = startAfter ? this.db.database.ref("/message/" + this.roomService.groupId).orderByChild("/createdAt")
        .startAt(startAfter).limitToFirst(this.msgsLimit) :
      this.db.database.ref("/message/" + this.roomService.groupId).orderByChild("createdAt").limitToFirst(this.msgsLimit);

    const msg = await refQ.once("value");
    const promises = [];
    const msgObj = msg.val() || {};
    const msgs = Object.keys(msgObj).reverse();
    for (const k of msgs) {
      promises.push(new Promise(async resolve => {
        const sf = msgObj[ k ].sendFrom;
        const snap = await this.db.database.ref("/users/").child(sf).once("value");
        const p = snap.val().photo;
        const att = msgObj[ k ].attachment;
        const data = await Promise.all([ this.getPhoto(p), this.getAtt(att) ]);
        const m = { id: k, msg: msgObj[ k ], sender: snap.val() };
        m.sender.photo = data[ 0 ] || "../../../assets/images/photo_profile2.jpeg";
        m.msg.attachment = data[ 1 ];
        resolve(m);
      }));
    }
    const snapshot = await Promise.all(promises);
    for (const ms of snapshot) {
      this.messages$.next(ms);
    }
    return snapshot;
  }

  getPhoto(p: string): Promise<any> {
    return p ? this.storage.storage.ref().child(p).getDownloadURL() : null;
  }

  async getAtt(att: Message["msg"]["attachment"]): Promise<any> {
    const attach = [];
    return new Promise<any>(resolve => {
      if (att) {
        att.map(async (a) => {
          const link = await this.storage.storage.ref().child(a).getMetadata();
          attach.push({ contentType: link.contentType, downloadURLs: link.downloadURLs });
          if (attach.length === att.length) {
            resolve(attach);
          }
        });
      } else {
        resolve([]);
      }
    });
  }

  messagesUpdate() {
    this.db.database.ref("/message/" + this.roomService.groupId).limitToLast(1).on("child_added", (msgs) => {
      this.messageHandle(msgs);
    });
    this.db.database.ref("/message/" + this.roomService.groupId).on("child_changed", (msgs) => {
      this.messageHandle(msgs);
    });
  }

  async messageHandle(msgs) {
    const message = msgs.val() || {};
    const msgId = msgs.key;
    const snapshot = await this.db.database.ref("/users/" + message.sendFrom).once("value");
    const p = snapshot.val().photo;
    const att = message.attachment;
    const data = await Promise.all([
      this.getPhoto(p),
      this.getAtt(att),
    ]);
    const m = { id: msgId, msg: message, sender: snapshot.val(), newMsg: true };
    m.sender.photo = data[ 0 ] || "../../../assets/images/photo_profile2.jpeg";
    m.msg.attachment = data[ 1 ];
    this.messages$.next(m);
  }

  async sendMsg(msg: Message["msg"]) {
    const filesPaths = [];
    const promises = [];
    if (msg.attachment) {
      this.isFileUploaded$.next(false);

      for (const file of msg.attachment) {

        const filePath = "files/" + this.userId + "/" + new Date() + (<File>file).name;
        filesPaths.push(filePath);
        promises.push(this.storage.storage.ref().child(filePath).put(file));
      }
    }

    await Promise.all(promises);
    await this.db.database.ref("/message/" + this.roomService.groupId).push().set({
      text: msg.text || "",
      sendFrom: this.userId,
      attachment: [ ...filesPaths ],
      createdAt: -(new Date()),
      edited: false,
    });
    this.isFileUploaded$.next(true);
  }

  editMessage(msg) {
    this.db.database.ref("/message/" + this.roomService.groupId + "/" + msg.id).update({
      text: msg.msg.text, edited: true
    });
  }


}


