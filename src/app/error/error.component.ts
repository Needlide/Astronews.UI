import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: false
})
export class ErrorComponent implements OnInit {
  errorMessage: string | undefined;
  returnUrl: string = '/';
  constructor(private errorService: ErrorService, private router: Router) {}

  ngOnInit(): void {
    this.errorService.errorMessage$.subscribe((message) => {
      this.errorMessage = message;
    });
    this.returnUrl =
      history.state?.returnUrl || this.getAndClearLocalStorageUrl() || '/';
  }

  private getAndClearLocalStorageUrl(): string | null {
    try {
      const url = localStorage.getItem('returnUrl');
      localStorage.removeItem('returnUrl');
      return url;
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  }

  goBack() {
    this.router.navigateByUrl(this.returnUrl);
  }
}
