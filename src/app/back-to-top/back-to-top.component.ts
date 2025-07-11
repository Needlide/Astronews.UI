import { Component } from '@angular/core';

@Component({
    selector: 'app-back-to-top',
    templateUrl: './back-to-top.component.html',
    styleUrls: ['./back-to-top.component.scss'],
    standalone: false
})
export class BackToTopComponent {
  scrollToTop() {
    const duration = 500;
    const start = document.body.scrollTop || document.documentElement.scrollTop;
    const startTime = performance.now();

    function scrollStep(currentTime: DOMHighResTimeStamp) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const scrollTop = start * (1 - progress);

      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;

      if (elapsedTime < duration) {
        window.requestAnimationFrame(scrollStep);
      }
    }

    window.requestAnimationFrame(scrollStep);
  }
}
