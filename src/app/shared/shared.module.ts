import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ValidationErrorMessageComponent } from "../components/validation-error-message/validation-error-message.component";
import { ObjectFirstKeyPipe } from "../pipes/object-first-key.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ValidationErrorMessageComponent,
    ObjectFirstKeyPipe
  ],
  exports: [
    CommonModule,
    ValidationErrorMessageComponent,
    ObjectFirstKeyPipe
  ]
})
export class SharedModule {
}
