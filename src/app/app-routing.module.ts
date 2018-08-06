import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService, IsLoggedInAuthPageGuard } from "./guards";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth",
    pathMatch: "full"
  },
  {
    canLoad: [ IsLoggedInAuthPageGuard ],
    canActivate: [ IsLoggedInAuthPageGuard ],
    path: "auth",
    loadChildren: "app/auth/auth.module#AuthModule"
  },
  {
    canLoad: [ AuthGuardService ],
    canActivate: [ AuthGuardService ],
    path: "chat",
    loadChildren: "app/chat/chat.module#ChatModule"
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
