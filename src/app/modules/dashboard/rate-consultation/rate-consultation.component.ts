import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rate-consultation',
  templateUrl: './rate-consultation.component.html',
  styleUrl: './rate-consultation.component.scss'
})
export class RateConsultationComponent implements OnChanges{

  @Input() RatingData: any;   // your API data
  @Output() submitFeedback = new EventEmitter<any>();
  @Input() consultant: any;
  @Input() custRating: any;

  rating = 0;
  comment = '';

  feedbackOptions = [
    { key: 'ListenedCarefully', label: 'Listened Carefully' },
    { key: 'ClearExplanation', label: 'Clear Explanation' },
    { key: 'ProfessionalandKnowledgeable', label: 'Professional and Knowledgelable' },
    { key: 'PoorConnectionQuality', label: 'Poor Connection Quality' },
    { key: 'QuickResponse', label: 'Quick Response' },
    { key: 'UnprofessionalBehaviour', label: 'Unprofessional Behaviour' }
  ];

  ngOnChanges() {
    if (this.RatingData) {
      this.rating = this.custRating || 0;
      this.comment = this.RatingData.FeedbackComments || '';
    }
  }

  setRating(value: number) {
    this.rating = value;
  }

  toggleOption(key: string) {
    this.RatingData[key] = this.RatingData[key] ? 0 : 1;
  }

  submit() {
    const payload = {
      BookingId: this.RatingData.BookingId,
      FeedbackRating: this.rating,
      FeedbackComments: this.comment,
      ListenedCarefully: this.RatingData.ListenedCarefully,
      ClearExplanation: this.RatingData.ClearExplanation,
      Professional: this.RatingData.ProfessionalandKnowledgeable,
      PoorConnection: this.RatingData.PoorConnectionQuality,
      QuickResponse: this.RatingData.QuickResponse,
      Unprofessional: this.RatingData.UnprofessionalBehaviour
    };

    this.submitFeedback.emit(payload);
  }


}
