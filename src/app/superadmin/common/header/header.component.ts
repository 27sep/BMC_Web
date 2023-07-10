import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../../common.css', './header.component.css']
})
export class HeaderComponent {

  togggleSidebar() {
    const sidebarParentElement = document.querySelector('.sidebar-parent') as HTMLDivElement;
    sidebarParentElement && sidebarParentElement.classList.toggle('d-none');
    const appContentElement = document.querySelector('.app-content') as HTMLDivElement;
    appContentElement && appContentElement.classList.toggle('col-lg-9');
    appContentElement && appContentElement.classList.toggle('col-xl-9');
    appContentElement && appContentElement.classList.toggle('col-lg-12');
    const miniSidebarElement = document.querySelector('#mini-sidebar') as HTMLDivElement;
    miniSidebarElement && miniSidebarElement.classList.toggle('toggled');
    const pageContentElement = document.querySelector('.page-content') as HTMLDivElement;
    pageContentElement && pageContentElement.classList.toggle('toggled');
  }

}
