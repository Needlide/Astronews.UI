import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() displayItemsPerPage: boolean = true;
  @Input() totalItems: number = 0;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  public itemsPerPage: number[] = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  public selectedItemsPerPage: number = 30;
  public currentPage: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.selectedItemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }
}
