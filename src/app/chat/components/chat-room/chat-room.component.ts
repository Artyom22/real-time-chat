import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { User } from "../../../models";
import { MessagesService, UserService, ChatRoomService } from "../../../services";
import { Message } from "../../../models/message";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { PushNotificationsService } from "../../../services/push-notifications.service";

@Component({
  selector: "app-chat-room",
  templateUrl: "./chat-room.component.html",
  styleUrls: [ "./chat-room.component.scss" ]
})
export class ChatRoomComponent implements OnInit, AfterViewChecked, OnDestroy {
  messages: Message[] = [];
  messagesIds: String[] = [];
  currentUser: User;
  userId: string;
  isSpinnerInvisible = false;
  isFileUploaded = true;
  loaded = true;
  editMode = false;
  editId: string;
  modalRef: BsModalRef;
  password: FormControl;
  passwordForm: FormGroup;

  @Output() notify = new EventEmitter<any>();

  @ViewChild("chatContainer") chatContainer: ElementRef;
  @ViewChild("askPasswordForm") askPasswordForm: TemplateRef<any>;

  constructor(private messagesService: MessagesService,
              private user: UserService,
              private roomService: ChatRoomService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private router: Router,
              private _notificationService: PushNotificationsService) {
  }


  async ngOnInit() {
    await this.roomService.initRoomId(this.route.params);

    await this.roomService.usersUpdate();

    if (await this.roomService.showPasswordForm()) {
      await this.userIn();
      await this.loadMessages();
    } else {
      await this.askPassword(this.askPasswordForm);
    }
  }

  async askPassword(template: TemplateRef<any>) {
    await this.createForm();
    this.modalRef = this.modalService.show(template);
  }

  createForm() {
    this.password = new FormControl("", [
        Validators.minLength(8),
        Validators.required,
      ], this.checkPassword.bind(this)
    );

    this.passwordForm = new FormGroup({
      password: this.password
    });
  }

  async getNotifications() {
    this.roomService.usersInRoom$.subscribe((data) => {
      if (data[ "id" ] != this.user.userId) {
        this.sendNotification(`user ${data[ "action" ]} the room`, `${data[ "data" ].name} ${data[ "data" ].surname} ${data[ "action" ]} the room`);
      }
    });
  }

  async loadMessages() {
    this.messagesService.messages$.subscribe((data: Message) => {
      if (data.newMsg) {
        if (data.msg.edited) {
          this.messages[ this.messagesIds.indexOf(data.id) ] = data;
        } else if (this.messages.length === 0 ||
          this.messages[ this.messages.length - 1 ].id !== data.id) {
          this.messages.push(data);
          this.messagesIds.push(data.id);
          if (this.user.userId !== data[ "msg" ].sendFrom) {
            this.sendNotification(`new message from  ${data[ "sender" ].username}  `, ` ${data[ "sender" ].name} ${data[ "sender" ].surname} send a message`);
          }

        }
      } else if ((!this.messages[ 0 ] && !data.newMsg) ||
        (this.messages[ 0 ] && this.messages[ 0 ].id !== data.id)) {
        this.messages.unshift(data);
        this.messagesIds.unshift(data.id);
      }
      this.isSpinnerInvisible = true;
    });
    await this.messagesService.loadMessages();
    this.messagesService.messagesUpdate();

    this.currentUser = await this.user.getUserDetails();
    this.userId = this.user.userId;
    this.isSpinnerInvisible = true;
  }

  ngAfterViewChecked(): void {
    if (this.messages && this.messages.length <= this.messagesService.msgsLimit && this.loaded) {
      this.chatContainer.nativeElement.scrollTo(0, document.querySelector(".chat-room").scrollHeight);
      if (this.messages.length === this.messagesService.msgsLimit) {
        this.loaded = false;
      }
    }
  }

  scrollHandler(): void {
    if (this.isSpinnerInvisible) {
      this.messagesService.loadMessages(this.messages[ 0 ].msg.createdAt);
      this.isSpinnerInvisible = false;
    }
  }

  checkImageType(file: string): boolean {
    return file.includes("image");
  }

  switchMode(id) {
    this.editMode = !this.editMode;
    this.editId = id;
  }

  edit(e) {
    this.editMode = false;
    this.messagesService.editMessage(e);
  }

  cancel(e) {
    this.editMode = false;
  }

  async checkPassword() {
    if (this.password && this.password.value.length >= 8) {
      const isPasswordMatches = await this.roomService.checkPassword(this.password.value);
      return isPasswordMatches ? null : { invalid: true };
    }
  }

  async onSubmit() {
    if (this.passwordForm.valid) {
      this.modalRef.hide();
      await this.userIn();
      this.loadMessages();
    }
  }

  beforeHide() {
    this.router.navigate([ "/chat" ]);
  }

  sendNotification(title, content): void {
    let data: Array<any> = [];
    data.push({
      "title": title,
      "alertContent": content
    });

    this._notificationService.generateNotification(data);
  }

  async ngOnDestroy() {
    await this.roomService.updateUserOff(this.roomService.groupId, this.user.userId);
  }

  async userIn() {
    await this.roomService.updateUserOn(this.roomService.groupId, this.user.userId);
    this.getNotifications();
  }


}
