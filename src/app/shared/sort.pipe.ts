import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
    standalone: false
})
export class SortPipe implements PipeTransform {
  transform(
    array: any[],
    field: string | null,
    direction: 'asc' | 'desc' | null
  ): any[] {
    if (!Array.isArray(array) || !field || !direction) {
      return array;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
