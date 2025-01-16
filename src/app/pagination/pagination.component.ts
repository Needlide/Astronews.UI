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
  @Input() currentPage: number = 1;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  public itemsPerPage: number[] = [
    20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200,
  ];
  public selectedItemsPerPage: number = 30;

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
