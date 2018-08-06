import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "objectFirstKey"
})
export class ObjectFirstKeyPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value[Object.keys(value)[0]];
  }
}
