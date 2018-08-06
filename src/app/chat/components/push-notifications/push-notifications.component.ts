import { Component, OnInit,Input, Output, EventEmitter } from "@angular/core";
import { PushNotificationsService } from "../../../services";

@Component({
  selector: "app-push-notifications",
  templateUrl: "./push-notifications.component.html",
  styleUrls: [ "./push-notifications.component.scss" ]
})
export class PushNotificationsComponent implements OnInit {

  @Input() title: string;
  @Input() content: string;
  constructor(private _notificationService: PushNotificationsService) {
    this._notificationService.requestPermission();
  }

  ngOnInit() {
  }

  notify() {
    // let data: Array < any >= [];
    // data.push({
    //   'title': this.title,
    //   'alertContent': this.content
    // });
    //
    // this._notificationService.generateNotification(data);
  }
}
