import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-pagination',
    imports: [FormsModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() displayItemsPerPage: boolean = true;
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() selectedItemsPerPage: number = 50;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() itemsPerPageChanged: EventEmitter<number> = new EventEmitter();

  public itemsPerPage: number[] = [
    20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200,
  ];

  get totalPages(): number {
    return this.totalItems > 0
      ? Math.ceil(this.totalItems / this.selectedItemsPerPage)
      : 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }

  onItemsPerPageChange(): void {
    this.itemsPerPageChanged.emit(this.selectedItemsPerPage);
  }
}
