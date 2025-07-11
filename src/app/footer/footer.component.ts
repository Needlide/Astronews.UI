import { Component } from '@angular/core';
import { ROUTES } from '../app.routes';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {
  routes = ROUTES;
}
