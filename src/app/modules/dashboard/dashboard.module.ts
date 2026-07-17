import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ReOrdersComponent } from './re-orders/re-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyHealthRecordsComponent } from './my-health-records/my-health-records.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';
import { FamilyMembersComponent } from './family-members/family-members.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { RequestedProductsComponent } from './requested-products/requested-products.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PayNowComponent } from './pay-now/pay-now.component';
import { BuyAgainComponent } from './buy-again/buy-again.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { ServiceRequestStatusComponent } from './service-request-status/service-request-status.component';
import { RequestReturnComponent } from './request-return/request-return.component';
import { RoutePathComponent } from './route-path/route-path.component';
import { ManageHealthbuddyComponent } from './manage-healthbuddy/manage-healthbuddy.component';
import { LabBookingsComponent } from './lab-bookings/lab-bookings.component';
import { TrackLabBookingComponent } from './track-lab-booking/track-lab-booking.component';
import { LabBookingDetailsComponent } from './lab-booking-details/lab-booking-details.component';
import { RescheduleBookingComponent } from './reschedule-booking/reschedule-booking.component';
import { BookAgainLabtestComponent } from './book-again-labtest/book-again-labtest.component';
import { BuyAgainPatientComponent } from './buy-again-patient/buy-again-patient.component';
import { BuyAgainOrderComponent } from './buy-again-order/buy-again-order.component';
import { BuyAgainProductComponent } from './buy-again-product/buy-again-product.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { SharedModule } from '../shared/shared.module';
import { BookConsultationComponent } from './book-consultation/book-consultation.component';
import { ConsultationSummaryComponent } from './consultation-summary/consultation-summary.component';
import { DoctorConsultationComponent } from './doctor-consultation/doctor-consultation.component';
import { AllDoctorConsultationsComponent } from './all-doctor-consultations/all-doctor-consultations.component';
import { RateConsultationComponent } from './rate-consultation/rate-consultation.component';
import { HealthCardDetailsComponent } from './health-card-details/health-card-details.component';
import { HealthCardsListComponent } from './health-cards-list/health-cards-list.component';
import { MapLocationPickerComponent } from '../../components/map-location-picker/map-location-picker.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AllOrdersComponent,
    ReOrdersComponent,
    MyAccountComponent,
    MyProfileComponent,
    MyHealthRecordsComponent,
    ManageAddressComponent,
    FamilyMembersComponent,
    ChangePasswordComponent,
    ManageAccountComponent,
    RequestedProductsComponent,
    SidebarComponent,
    OrderDetailsComponent,
    PayNowComponent,
    BuyAgainComponent,
    TrackOrderComponent,
    ServiceRequestStatusComponent,
    RequestReturnComponent,
    RoutePathComponent,
    ManageHealthbuddyComponent,
    LabBookingsComponent,
    TrackLabBookingComponent,
    LabBookingDetailsComponent,
    RescheduleBookingComponent,
    BookAgainLabtestComponent,
    BuyAgainPatientComponent,
    BuyAgainOrderComponent,
    BuyAgainProductComponent,
    MyWalletComponent,
    BookConsultationComponent,
    ConsultationSummaryComponent,
    DoctorConsultationComponent,
    AllDoctorConsultationsComponent,
    RateConsultationComponent,
    HealthCardDetailsComponent,
    HealthCardsListComponent,
    MapLocationPickerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DashboardModule { }
