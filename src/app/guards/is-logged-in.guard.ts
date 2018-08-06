import { Injectable } from "@angular/core";
import {
  CanLoad, CanActivate, Route, Router,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "../services";

@Injectable()
export class AuthGuardService implements CanLoad, CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  async canLoad(route: Route): Promise<boolean> {
    const isLoggedIn = await this.auth.isUserLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate([ "/auth" ]);
    }

    return isLoggedIn;
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const isLoggedIn = await this.auth.isUserLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate([ "/auth" ]);
    }

    return isLoggedIn;
  }
}
