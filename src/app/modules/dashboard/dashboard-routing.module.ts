import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { ReOrdersComponent } from './re-orders/re-orders.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyHealthRecordsComponent } from './my-health-records/my-health-records.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';
import { FamilyMembersComponent } from './family-members/family-members.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { RequestedProductsComponent } from './requested-products/requested-products.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ServiceRequestStatusComponent } from './service-request-status/service-request-status.component';
import { RequestReturnComponent } from './request-return/request-return.component';
import { ManageHealthbuddyComponent } from './manage-healthbuddy/manage-healthbuddy.component';
import { LabBookingsComponent } from './lab-bookings/lab-bookings.component';
import { LabBookingDetailsComponent } from './lab-booking-details/lab-booking-details.component';
import { BookAgainLabtestComponent } from './book-again-labtest/book-again-labtest.component';
import { BuyAgainComponent } from './buy-again/buy-again.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { BookConsultationComponent } from './book-consultation/book-consultation.component';
import { ConsultationSummaryComponent } from './consultation-summary/consultation-summary.component';
import { DoctorConsultationComponent } from './doctor-consultation/doctor-consultation.component';
import { AllDoctorConsultationsComponent } from './all-doctor-consultations/all-doctor-consultations.component';
import { HealthCardDetailsComponent } from './health-card-details/health-card-details.component';
import { HealthCardsListComponent } from './health-cards-list/health-cards-list.component';

const routes: Routes = [
   {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'myaccount', pathMatch: 'full' },
      { path: 'myaccount', component: MyAccountComponent },
      { path: 'orderlist', component: AllOrdersComponent },
      { path: 'orderview/:orderID', component: OrderDetailsComponent },
      { path: 'servicerequest/:orderID', component: ServiceRequestStatusComponent },
      { path: 'returnrequest/:orderID/:invoiceID', component: RequestReturnComponent },
      { path: 'buyagain', component: BuyAgainComponent },
      // { path: 'reorder', component: ReOrdersComponent },
      { path: 'requestproduct', component: RequestedProductsComponent },
      { path: 'profile', component: MyProfileComponent },
      { path: 'health_records', component: MyHealthRecordsComponent },
      { path: 'address', component: ManageAddressComponent },
      { path: 'family', component: FamilyMembersComponent },
      { path: 'change_password', component: ChangePasswordComponent },
      { path: 'manage_account', component: ManageAccountComponent },
      // { path: 'healthbuddy', component: ManageHealthbuddyComponent },
      { path: 'lab-bookings', component: LabBookingsComponent },
      { path: 'booking-details/:bookingID', component: LabBookingDetailsComponent },
      { path: 'bookagain/:bookingID', component: BookAgainLabtestComponent },
      // { path: 'wallet', component: MyWalletComponent },
      { path: 'book-consultation/:bookingID', component: BookConsultationComponent },
      // { path: 'online_consultation', component: DoctorConsultationComponent },
      // { path: 'consultation-list', component: AllDoctorConsultationsComponent },
      // { path: 'consultation-summary/:bookingNo', component: ConsultationSummaryComponent },
      { path: 'CFH_Redemptions', component: HealthCardDetailsComponent },
      { path: 'health_cards', component: HealthCardsListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
