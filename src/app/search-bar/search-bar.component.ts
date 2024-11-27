import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SearchService } from '../search.service';
import { Subject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  public searchTerm: string = '';
  private searchSubject = new Subject<string>();

  @Input() debounceTimeDuration: number = 730;
  // Notify the parent components about changes in search term
  @Output() searchChange = new EventEmitter<string>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(this.debounceTimeDuration)).subscribe((searchText) => {
      this.searchService.setSearchTerm(searchText);
      this.searchChange.emit(searchText); // Emit the search term change to a parent
    });
  }

  clearSearch(): void {
    this.searchService.setSearchTerm('');
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  onSearchTermChange(): void {
    this.searchSubject.next(this.searchTerm);
  }
}
