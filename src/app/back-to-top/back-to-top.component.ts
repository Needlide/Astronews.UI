import { Component } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {
  scrollToTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
