import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export class ValidatorMsgs {

  /**
   * Core methods that will wrap default validation methods
   */

  private static methodWrapper(methodName: string, message: string, argument: any): ValidatorFn {
    const _validator = Validators[ methodName ](argument);
    return (control: AbstractControl): ValidationErrors => {
      const error = _validator(control);
      return ValidatorMsgs.handleError(error, message);
    };
  }

  private static methodWrapperError(methodName: string, message: string, argument: any): ValidationErrors {
    const error = Validators[ methodName ](argument);
    return ValidatorMsgs.handleError(error, message);
  }

  private static handleError(error: ValidationErrors, message: string) {
    if (error) {
      const firstError = Object.keys(error)[ 0 ];
      error[ firstError ] = { message };
      return { [firstError]: error[ firstError ] };
    }
    return null;
  }

  /**
   * Wrap default validators
   */

  static min(min: number): ValidatorFn {
    return ValidatorMsgs.methodWrapper("min", `The value should be greater than a ${min}`, min);
  }

  static max(max: number): ValidatorFn {
    return ValidatorMsgs.methodWrapper("max", `The value should be greater than a ${max}`, max);
  }

  static required(control: AbstractControl): ValidationErrors {
    return ValidatorMsgs.methodWrapperError("required", `The field is required`, control);
  }

  static requiredTrue(control: AbstractControl): ValidationErrors {
    return ValidatorMsgs.methodWrapperError("requiredTrue", `The value is wrong`, control);
  }

  static email(control: AbstractControl): ValidationErrors {
    return ValidatorMsgs.methodWrapperError("email", `Invalid Email`, control);
  }

  static minLength(min: number): ValidatorFn {
    return ValidatorMsgs.methodWrapper("minLength", `Minimum length is ${min}`, min);
  }

  static maxLength(max: number): ValidatorFn {
    return ValidatorMsgs.methodWrapper("maxLength", `Maximum length is ${max}`, max);
  }

  static pattern(pattern: string | RegExp): ValidatorFn {
    return ValidatorMsgs.methodWrapper("pattern", `The value is Wrong`, pattern);
  }

  /**
   * Custom Validation Methods
   */

  static passwordConfirming(password: FormControl, passwordCf: FormControl, message = `Passwords do not match`): ValidatorFn {
    return (): ValidationErrors => {
      if (password.value !== passwordCf.value) {
        const doNotMatch = { doNotMatch: { message: message } };
        passwordCf.setErrors(doNotMatch);
        return doNotMatch;
      }
      return null;
    };
  }

}

