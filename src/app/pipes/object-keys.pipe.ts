import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "objectKeys",
  pure: false
})
export class ObjectKeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Object.keys(value);
  }

}
