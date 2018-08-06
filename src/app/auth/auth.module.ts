import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { authComponents, AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
  ],
  declarations: [
    authComponents,
  ],
})
export class AuthModule {
}
