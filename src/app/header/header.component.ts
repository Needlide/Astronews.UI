import { Component, Renderer2 } from '@angular/core';
import { ROUTES } from '../app.routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  routes = ROUTES;
  public isLightTheme = false;
  public searchTerm: string = '';
  public isVisible = false;

  constructor(private renderer: Renderer2) {}

  public toggleTheme() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }

  public toggleMenu() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  public onMenuVisibilityChange() {
    this.toggleMenu();
  }

  public onLightThemeChange(value: boolean) {
    this.isLightTheme = value;
  }
}
