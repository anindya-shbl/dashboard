import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-small-img-med-otc',
  templateUrl: './small-img-med-otc.component.html',
  styleUrl: './small-img-med-otc.component.scss'
})
export class SmallImgMedOTCComponent {
  @Input() prodImages: any = [];
  @Input() veganType: any = '';
  showImg: any = '';
  currentIndex = 0; // start from first image

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent!: ElementRef;
  @ViewChild('zoomImg') zoomImg!: ElementRef<HTMLImageElement>;

  ngOnInit() {
    if (this.prodImages?.length) {
      this.setImg(this.prodImages[0].DisplaySeq); // show first image
    }
  }

  setImg(seq: any) {
    this.showImg = this.prodImages.find((obj: any) => obj.DisplaySeq == seq);
  }

  scrollDown(): void {
    if (!this.widgetsContent) return;

    this.widgetsContent.nativeElement.scrollTo({
      top: this.widgetsContent.nativeElement.scrollTop + 60,
      behavior: 'smooth',
    });

    if (this.currentIndex < this.prodImages.length - 1) {
      this.currentIndex++;
    }
  }

  scrollUp(): void {
    if (!this.widgetsContent) return;

    this.widgetsContent.nativeElement.scrollTo({
      top: this.widgetsContent.nativeElement.scrollTop - 60,
      behavior: 'smooth',
    });

    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  onMouseMove(event: MouseEvent) {
    const img = this.zoomImg.nativeElement;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2.5)'; // zoom level
  }

  onMouseLeave() {
    const img = this.zoomImg.nativeElement;
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  }
}
