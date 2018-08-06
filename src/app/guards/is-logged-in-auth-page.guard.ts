import { Injectable } from "@angular/core";
import { CanLoad, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";
import { AuthService } from "../services";

@Injectable()
export class IsLoggedInAuthPageGuard implements CanLoad, CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  async canLoad(route: Route): Promise<boolean> {
    const isLoggedIn = await this.auth.isUserLoggedIn();
    if (isLoggedIn) {
      this.router.navigate([ "/chat" ]);
    }

    return !isLoggedIn;
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const isLoggedIn = await this.auth.isUserLoggedIn();

    if (isLoggedIn) {
      this.router.navigate([ "/chat" ]);
    }

    return !isLoggedIn;
  }
}
