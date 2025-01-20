import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search/search.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { minSymbolsToTriggerSearch } from '../shared/constants';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  public searchTerm: string = '';
  private searchSubscription: Subscription = new Subscription();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchService.searchTerm$.subscribe(
      (searchText) => {
        this.searchTerm = searchText;
      }
    );
  }

  clearSearch(): void {
    this.searchService.setSearchTerm('');
    this.searchTerm = '';
  }

  onSearchTermChange(): void {
    if (this.searchTerm.length >= minSymbolsToTriggerSearch) {
      this.searchService.setSearchTerm(this.searchTerm);
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
}
