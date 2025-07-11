import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
    standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string | null {
    if (value) {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'MMMM d, yyyy');
    }
    return '';
  }
}
