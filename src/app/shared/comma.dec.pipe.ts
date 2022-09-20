import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeComma'
})
export class CommaDecPipe implements PipeTransform {

  transform(val: any, len:number): string {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      
      return parseFloat(parseFloat(val).toFixed(len)).toString();
    } else {
      return "0";
    }
  }
}