import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireStorage } from "angularfire2/storage";
import { User } from "../models";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {

  userId: string;

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth,
              private storage: AngularFireStorage, private router: Router,
              private userService: UserService) {
  }

   init() {
    this.auth.authState.pipe(tap(async user => {
      if (user) {
        this.userId = user.uid;
        await this.userService.init();
      }

    }))
      .subscribe();
  }

  async login(data: { email: string, password: string }) {
    try {
      await  this.auth.auth.signInWithEmailAndPassword(data.email, data.password);
      this.router.navigate([ "/chat" ]);
    } catch (error) {
      console.log(error);
    }
  }

  async register(user: User, photoFile: File, password: string) {
    try {
      const data = await this.auth.auth.createUserWithEmailAndPassword(user.email, password);
      if (photoFile) {
        this.storage.storage.ref().child("images/" + data.uid).put(photoFile);
      }
      await this.db.database.ref("users/" + data.uid).set({
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        photo: photoFile ? "images/" + data.uid : null
      });
      this.router.navigate([ "/chat" ]);

    } catch (err) {
      console.log(err);
    }

  }

  isUserLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async signOut() {
    await this.auth.auth.signOut();
    this.router.navigate([ "/auth" ]);
    this.userService.userStatusToggle(false);
  }
}
