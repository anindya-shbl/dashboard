import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-medotc',
  templateUrl: './image-medotc.component.html',
  styleUrl: './image-medotc.component.scss'
})
export class ImageMedotcComponent {
  @Input() prodImages: any = [];
  @Input() veganType: any = '';
  showImg: any = '';
  currentIndex = 5;

  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any> | undefined;
  @ViewChild('zoomImg') zoomImg!: ElementRef<HTMLImageElement>;

  ngOnInit() {
    // this.prodImages = this.productDetails['product'][0]['product_images'];
    this.setImg(1);
  }

  setImg(seq: any) {
    this.showImg = this.prodImages.find((obj: any) => {
      return obj.DisplaySeq == seq;
    })
  }

  scrollRight(): void {
    this.widgetsContent?.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 70), behavior: 'smooth' });
    if (this.currentIndex < this.prodImages.length) {
      this.currentIndex++;
    }
  }

  scrollLeft(): void {
    this.widgetsContent?.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 70), behavior: 'smooth' });
    if (this.currentIndex > 5) {
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
