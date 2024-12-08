import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataSort'
})
export class DataSortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array)) {
      return array;
    }
    array.sort((a: any, b: any) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return dateA < dateB ? 1 : -1;
    });
    return array;
  }

}
