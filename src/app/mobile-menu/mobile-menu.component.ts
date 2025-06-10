import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent {
  @Input() isLightTheme = false;
  @Output() isLightThemeChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() isVisible = false;
  @Output() isVisibleChange: EventEmitter<void> = new EventEmitter<void>();

  public toggleTheme() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
    this.isLightThemeChange.emit(this.isLightTheme);
  }

  public closeMenu() {
    this.isVisible = !this.isVisible;
    this.isVisibleChange.emit();
  }
}
