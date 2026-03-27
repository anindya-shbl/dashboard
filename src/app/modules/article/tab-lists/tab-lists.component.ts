import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-lists',
  templateUrl: './tab-lists.component.html',
  styleUrl: './tab-lists.component.scss'
})
export class TabListsComponent implements AfterViewInit {

  @ViewChild('tabsRef') tabsRef!: ElementRef<HTMLDivElement>;

  @Input()tabList: any;
  @Input()currentTab: any;

  currentIndex = 0;
  tabWidth = 130; // default width
  isRightHidden = false;  

  @Output() changeCategoryType = new EventEmitter<any>();

  ngAfterViewInit() {
    setTimeout(() => this.updateButtons(), 0);
    
  }

  @HostListener('window:resize')
  onResize() {
    this.updateButtons();
  }

  updateButtons() {
    const containerWidth = this.tabsRef.nativeElement.parentElement!.offsetWidth;
    const visibleTabs = Math.floor(containerWidth / (this.tabWidth + 10));
    const maxIndex = this.tabList.length - visibleTabs;

    this.isRightHidden = this.currentIndex >= maxIndex || maxIndex <= 0;
  }

  moveTabs(direction: 'left' | 'right') {
    const containerWidth = this.tabsRef.nativeElement.parentElement!.offsetWidth;
    const visibleTabs = Math.floor(containerWidth / (this.tabWidth + 10));
    const maxIndex = this.tabList.length - visibleTabs;

    if (direction === 'left' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'right' && this.currentIndex < maxIndex) {
      this.currentIndex++;
    }

    this.updateButtons();
  }

  changeTabDetails(tab: any){
    this.changeCategoryType.emit(tab)
  }

}
