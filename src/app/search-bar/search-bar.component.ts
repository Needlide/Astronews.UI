import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.service';
import { Subject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  public searchTerm: string = '';
  private searchSubject = new Subject<string>();

  @Input() debounceTimeDuration: number = 730;
  @Input() minSearchLength: number = 3;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeDuration))
      .subscribe((searchText) => {
        this.searchService.setSearchTerm(searchText);
      });
  }

  clearSearch(): void {
    this.searchService.setSearchTerm('');
    this.searchTerm = '';
  }

  onSearchTermChange(): void {
    if (this.searchTerm.length >= this.minSearchLength) {
      this.searchSubject.next(this.searchTerm);
    }
  }
}
