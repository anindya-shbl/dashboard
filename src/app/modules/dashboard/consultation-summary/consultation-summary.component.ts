import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UploadImagesService } from '../../../services/upload-images.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-consultation-summary',
  templateUrl: './consultation-summary.component.html',
  styleUrl: './consultation-summary.component.scss'
})
export class ConsultationSummaryComponent implements OnInit {

  isloading: boolean = false;
  apmntDetails: any = '';
  @ViewChild('clsVitalMdl') clsVitalMdl: any;
  infoText: any = '';
  ReportDocuments: any = [];

  prscFiles: any = [];
  prscImages: any = [];

  referMeds: any = [];
  referedLabs: any = [];

  selectedTests: any = [];
  // selectedMeds: any = [];
  bookingNo: any = '';
  proceedMed: boolean = false;
  inputRating: any = '';
  ratingRes: any = '';

  @ViewChild('addLabsMdl') addLabsMdl: any;
  @ViewChild('addMedsMdl') addMedsMdl: any;
  @ViewChild('ratingMdl') ratingMdl: any;
  @ViewChild('clsaddLab') clsaddLab: any;
  @ViewChild('clsaddMeds') clsaddMeds: any;
  @ViewChild('clsrating') clsrating: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public CommonService: CommonService,
    private imagesService: UploadImagesService,
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.bookingNo = this.activatedRoute.snapshot.params['bookingNo'];

    if (this.bookingNo != undefined && this.bookingNo != '' && this.bookingNo != null) {
      this.spinner.show();
      this.isloading = true;
      this.getRatings();
      this.getAppointmentDetails();

    }
  }

  getAppointmentDetails() {
    this.referMeds = [];
    this.referedLabs = [];
    this.ReportDocuments = [];
    // this.orderService.getDetails(`webapi/consultation/appointment_details?bookingNo=${this.bookingNo}`).subscribe((res: any) => {
    let res: any = {
      "status": 200,
      "data": {
        "BookingId": 447,
        "BookingNo": "HA-ZEUKY4",
        "CustUserId": 588535,
        "CustomerName": "suman das",
        "AppointmentDate": "2025-11-24",
        "SlotStartTime": "16:44",
        "SlotEndTime": "16:47",
        "BookingStatusId": 5,
        "BookingStatus": "Consultation Closed",
        "ApplicationType": "M",
        "BillAmount": 250,
        "PatientId": 755103,
        "PatientName": "suman das",
        "AddressId": null,
        "Addline": null,
        "DoctorId": 51386,
        "Salutation": null,
        "DoctorName": "Prakash  Shaw",
        "DoctorType": null,
        "FollowUpYN": 0,
        "WaitingSince": "1410 m",
        "RefConsultanionId": null,
        "DoctorDegree": null,
        "SpecialityName": null,
        "MobileNo": 8000000009,
        "Gender": "M",
        "DOB": "2020-10-28",
        "Age": null,
        "PatientMobileNo": null,
        "PatientEmailId": null,
        "MeetingId": "bbb89c59-2249-47be-a4c8-897ac151bdf5",
        "DoctorTokenNo": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImEwMzc2YzFhLTdjZDgtNDhiNy04NTQ4LTI1NDY0OTE2MTI0ZCIsIm1lZXRpbmdJZCI6ImJiYjg5YzU5LTIyNDktNDdiZS1hNGM4LTg5N2FjMTUxYmRmNSIsInBhcnRpY2lwYW50SWQiOiJhYWE3YWEwNS0xZjZiLTQ4MTUtODhkMi1lODAwN2JhMDM3OGIiLCJwcmVzZXRJZCI6ImJlZjE3M2FlLTUxZjYtNDJlMC05MGM0LTQ2YjhlOTJmZWRmMyIsImlhdCI6MTc2Mzk3NzcxOSwiZXhwIjoxNzcyNjE3NzE5fQ.HIvWswLlqRH8qs4Wo9a0GDSSgJpmjnR58gGbMtQhxzSQU0TnAcjtAhQ8ylFiW1-Ue6Qg2EAIeCLv1qQLXS5Z_8bRregA5nwaD7c3Xy5Y-HgPTATDf6wzFE71SfH8LyQtFdtwajwSF8uqZZnBK_m397SoGvTMqIkTBTza52yNiLkR7ApXoy3AtK5cctAGRx6IJCBmjlPmd_3RAlRBNSaKv5Yp440gZWcfzmKEM7JMnRcW58L8bHT4uByFGCo_M9LvbwNdc3yDdjN3xvS14WI9ZE2DDPk52jh2KMTRGo2-ZdgdlCuAJWbGqsdqqyqPsb6IAbcykqvPBxNxklci4pWxHg",
        "PatientTokenNo": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImEwMzc2YzFhLTdjZDgtNDhiNy04NTQ4LTI1NDY0OTE2MTI0ZCIsIm1lZXRpbmdJZCI6ImJiYjg5YzU5LTIyNDktNDdiZS1hNGM4LTg5N2FjMTUxYmRmNSIsInBhcnRpY2lwYW50SWQiOiJhYWFlNjM0ZC1kNDExLTRhMjEtYTQwMC1kY2UwODY0MzMyNDMiLCJwcmVzZXRJZCI6IjI4NWJkYmViLWFlY2ItNGVjOS1hNDk1LWQ3ZDgyN2Q0NmEyYSIsImlhdCI6MTc2Mzk3NzcxOSwiZXhwIjoxNzcyNjE3NzE5fQ.QYY5k5qR-cTJHsVGaGRG1HsC-je56yZblCwMVFcNQjrIWsyxNxOlITEYMTKyXaPinTPg3Xe7vcCArjLyBD-tQKyV8EAB7h1qfZ5pA7DCcx8OIr9zb8muSuVqYFuUCZBGBYGg7GbxQVWyYEIo5ndmvDjLeyG-in3prjlDY2jXZYw_3witOAuZR8nt6ZbZIcnFkkaMrTYBi1VTdN8p1PV6fGALElfLey1ZX1Az7ODZvSjZpKTrXedaTh-39PzpLcHjSplnPzCOhQDH4Q4uMIJ1ycg3NJv6b_o0ncqJMmkQKa9J42GMHx3cuvTPI-czlfyI5ohxY0T_TfS__YDwROz51w",
        "PatientParticipantId": "b8bf03d4-8cdf-483d-931c-ba5ad0530e8c",
        "DoctorParticipantId": "c0334b5c-5fd7-4983-b762-2aa75aa96631",
        "MeetingTitle": "Doctor Appointment HA-YEY4GF--",
        "VCFilePath": "",
        "IsVCJoin": false,
        "IsNoShow": false,
        "MeraDocAppointmentId": null,
        "MeraDocDoctorId": null,
        "MeraDocSlotType": null,
        "MeraDocSlotId": null,
        "MeraDocPatientId": null,
        "MeraDocPatientNumber": null,
        "MeetLinkUrl": null,
        "ChiefComplaints": null,
        "SourceBookingId": null,
        "ModeOfConsultation": "V",
        "ReportFilePath": "",
        "SymptomesDetails": "",
        "RefBookingNo": "HA-YEY4GF",
        "BookingAmount": 250,
        "ItemDiscount": 0,
        "CouponDiscount": 0,
        "CouponId": null,
        "PromoCode": null,
        "PromoName": null,
        "PromoDesc": null,
        "PrescriptionId": 995932,
        "PrescriptionPath": "prescription_41684_HA-YEY4GF_896.pdf",
        "PrescriptionName": "prescription_41684_HA-YEY4GF_896.pdf",
        "ClinicName": "",
        "PreferredLanguage": "Hindi",
        "RefBookingStatusId": 5,
        "RefBookingStatusDesc": "Consultation Closed",
        "BookingDate": "24 November 2025 15:18:17",
        "PrescriptionFileName": "prescription_41684_HA-YEY4GF_896.pdf",
        "PrescriptionFilePath": "https://stage-serv-catalog.sastasundar.com/jito-upload/dwnpres?pname=prescription_41684_HA-YEY4GF_896.pdf",
        "DoctorDetails": {
          "DoctorId": 51386,
          "Salutation": "Dr.",
          "DoctorName": "Prakash  Shaw",
          "Gender": "",
          "RegsitrationNo": "DDD005",
          "Qualification": "FRCS, London",
          "MobileNo": "9874221889",
          "AlternativeContactNo": null,
          "EmailId": "doc5@ymail.com",
          "RegistrationYear": null,
          "SpecialityName": "ENT",
          "DoctorAddress": null,
          "DoctorSignature": "drsign.png",
          "DoctorExperience": null,
          "DoctorImage": null,
          "DoctorImageURL": null
        },
        "PatientVitalsInfo": {
          "BodyWeight": "56",
          "BodyTemp": "89",
          "BloodPressure": "120/87",
          "Pulse": "76",
          "Height": "145",
          "BMI": "26.63",
          "ChiefComplaint": "having fever and cold",
          "BkgId": 609,
          "SpO2": "99",
          "Documents": [],
          "ReportDocuments": [
            {
              "Filename": "prescription_1763980899_032176.pdf",
              "FileDownloadPath": "https://stage-serv-catalog.sastasundar.com/jito-upload/dwndoc?pname=prescription_1763980899_032176.pdf",
              "DocumentType": "Report"
            }
          ],
          "PrescriptionDocuments": [
            {
              "Filename": "prescription_1763981527_38405.pdf",
              "FileDownloadPath": "https://stage-serv-catalog.sastasundar.com/jito-upload/dwndoc?pname=prescription_1763981527_38405.pdf",
              "DocumentType": "Prescription"
            }
          ],
          "ChronicConditionData": [
            {
              "ConditionId": 633,
              "ConditionName": "blood"
            }
          ],
          "CommonAllergiesData": [
            {
              "ConditionId": 673,
              "ConditionName": "dust mites dust mites dust mites dust mites dust mites dust mites "
            }
          ],
          "MedicalAllergiesData": [],
          "SurgeriesData": []
        },
        "PrescriptionDetails": {
          "RefSource": "SS",
          "Symptoms": [],
          "Investigations": [],
          "ExistingMedication": [],
          "Medicines": [
            {
              "ProductName": "Caldikind",
              "Brand": "Mankind Pharma Ltd",
              "DosageForm": "capsule",
              "PrescriptionOTC": "P",
              "InteractiveModule": "",
              "InteractiveSubModule": "",
              "DeliveryDelayedDay": 0,
              "ProductId": "2906",
              "DisplayName": "Caldikind Cap (10 Cap)",
              "ProductAliasName": "Caldikind Cap (10 Cap)",
              "ProductImage": "caldikind-1406055869-10002894.jpg",
              "IsNew": 1,
              "HasOffer": "N",
              "IsGiftableProduct": 0,
              "IsCustomizable": 0,
              "IsFeatured": 0,
              "DosageRestriction": 0,
              "DosageAlert": 0,
              "Active": 1,
              "ProductStatus": "C",
              "IsRedeemable": 0,
              "DosageFormDisplaySeq": null,
              "DocumentId": "2906",
              "GroupSize": 1,
              "AvgRating": 0,
              "NumRating": 0,
              "OrderCount": 0,
              "NumCustomer": 0,
              "DisplayRank": 99,
              "Keywords": " medicine",
              "Strength": "Cap",
              "ProductShortDescription": "",
              "Salts": {
                "NameSearch": "calcitriol + calcium carbonate + zinc",
                "SaltStrengthRaw": "",
                "SaltSchedule": "",
                "SaltStrength": "CALCITRIOLCALCIUMCARBONATEZINCCAP",
                "Id": "1072",
                "Code": "SN01386",
                "Name": "CALCITRIOL + CALCIUM CARBONATE + ZINC",
                "SaltCategory": ""
              },
              "MfgGroup": "MANKIND PHARMA LTD",
              "EncodeProdId": "al2wz5",
              "PTR": 0,
              "PTRDiscPercent": 0,
              "SchemeFreeBaseQty": 0,
              "CustDiscPercent": 0,
              "CustOfferPrice": 0,
              "OfferCategoryId": 0,
              "OfferCategory": "",
              "OfferTitle": "",
              "OfferImage": "",
              "ApplyPincodeWiseDiscount": false,
              "IsPurchased": 0,
              "PKLotId": null,
              "RefProductId": null,
              "Unit1": "STRIP",
              "Unit2": "Cap",
              "Conversion1": 10,
              "IsGenericNew": 1,
              "IsIngestible": 0,
              "Unit": "Capsule",
              "Size": 10,
              "PreferredSubtitute": [],
              "SubstitueBrand": [
                {
                  "ProductId": 4477,
                  "DisplaySeq": 1,
                  "MRP": 0,
                  "DisplayName": "Admax Cap (10 Cap)",
                  "ProductImage": "admax-1406056121-10003801.jpg",
                  "CustDiscPercent": 0,
                  "CustOfferPrice": 0,
                  "Unit": "Capsules",
                  "Size": 10,
                  "MfgGroup": "ZUVENTUS HEALTHCARE LTD.",
                  "ExpiryDate": "",
                  "SourceProductId": "10003801",
                  "PrescriptionOTC": "P"
                },
                {
                  "ProductId": 2401,
                  "DisplaySeq": 1,
                  "MRP": 0,
                  "DisplayName": "Gemcal Cap (15 Cap)",
                  "ProductImage": "gemcal-1406055746-10002423.jpg",
                  "CustDiscPercent": 0,
                  "CustOfferPrice": 0,
                  "Unit": "Capsules",
                  "Size": 15,
                  "MfgGroup": "ALKEM LABORATORIES",
                  "ExpiryDate": "",
                  "SourceProductId": "10002423",
                  "PrescriptionOTC": "P"
                },
                {
                  "ProductId": 4662,
                  "DisplaySeq": 1,
                  "MRP": 0,
                  "DisplayName": "Gemitrol Cap (15 Cap)",
                  "ProductImage": "gemitrol-1406056054-10003563.jpg",
                  "CustDiscPercent": 0,
                  "CustOfferPrice": 0,
                  "Unit": "Capsule",
                  "Size": 15,
                  "MfgGroup": "TORRENT PHARMACEUTICALS LTD",
                  "ExpiryDate": "",
                  "SourceProductId": "10003563",
                  "PrescriptionOTC": "P"
                },
                {
                  "ProductId": 1661,
                  "DisplaySeq": 1,
                  "MRP": 0,
                  "DisplayName": "Calzem Cap (10 Cap)",
                  "ProductImage": "calzem-1406055555-10001730.jpg",
                  "CustDiscPercent": 0,
                  "CustOfferPrice": 0,
                  "Unit": "Capsules",
                  "Size": 10,
                  "MfgGroup": "CIPLA LTD",
                  "ExpiryDate": "",
                  "SourceProductId": "10001730",
                  "PrescriptionOTC": "P"
                },
                {
                  "ProductId": 26330,
                  "DisplaySeq": 1,
                  "MRP": 0,
                  "DisplayName": "Troycal CT Cap (10 Cap)",
                  "ProductImage": "",
                  "CustDiscPercent": 0,
                  "CustOfferPrice": 0,
                  "Unit": "Capsule",
                  "Size": 10,
                  "MfgGroup": "TROIKAA PHARMACEUTICALS LTD",
                  "ExpiryDate": "",
                  "SourceProductId": "10025388",
                  "PrescriptionOTC": "P"
                }
              ],
              "SourceProductId": "10002894",
              "FoodPreference": "",
              "ImporterName": "",
              "ImporterAddress": "",
              "GenericHBMargin": 10,
              "FSSAILicense": [],
              "PrimaryDisease": "",
              "CustHighDisc": 0,
              "OfferPrice": 0,
              "DiscountPercent": 0,
              "MinQty": 1,
              "IsOutOfStock": "Y",
              "IsCourierable": 0,
              "MRP": 0,
              "ExpiryDate": "",
              "LastMRP": 0,
              "score": 1
            },
            {
              "ProductName": "Gencitrol",
              "Brand": "Geno Pharmaceuticals Ltd.",
              "DosageForm": "tablet",
              "PrescriptionOTC": "P",
              "InteractiveModule": "",
              "InteractiveSubModule": "",
              "DeliveryDelayedDay": 0,
              "ProductId": "9881",
              "DisplayName": "Gencitrol Tab (10 Tab)",
              "ProductAliasName": "Gencitrol Tab (10 Tab)",
              "ProductImage": "gencitrol-1406057785-10010048.jpg",
              "IsNew": 1,
              "HasOffer": "N",
              "IsGiftableProduct": 0,
              "IsCustomizable": 0,
              "IsFeatured": 0,
              "DosageRestriction": 0,
              "DosageAlert": 0,
              "Active": 1,
              "ProductStatus": "C",
              "IsRedeemable": 0,
              "DosageFormDisplaySeq": null,
              "DocumentId": "9881",
              "GroupSize": 1,
              "AvgRating": 0,
              "NumRating": 0,
              "OrderCount": 0,
              "NumCustomer": 0,
              "DisplayRank": 99,
              "Keywords": " medicine",
              "Strength": "Tab",
              "ProductShortDescription": "",
              "Salts": {
                "NameSearch": "calcitriol + calcium carbonate + zinc",
                "SaltStrengthRaw": "",
                "SaltSchedule": "",
                "SaltStrength": "CALCITRIOLCALCIUMCARBONATEZINCTAB",
                "Id": "1072",
                "Code": "SN01386",
                "Name": "CALCITRIOL + CALCIUM CARBONATE + ZINC",
                "SaltCategory": ""
              },
              "MfgGroup": "GENO PHARMACEUTICALS LTD.",
              "EncodeProdId": "na6h92",
              "PTR": 0,
              "PTRDiscPercent": 0,
              "SchemeFreeBaseQty": 0,
              "CustDiscPercent": 0,
              "CustOfferPrice": 0,
              "OfferCategoryId": 0,
              "OfferCategory": "",
              "OfferTitle": "",
              "OfferImage": "",
              "ApplyPincodeWiseDiscount": false,
              "IsPurchased": 0,
              "PKLotId": null,
              "RefProductId": null,
              "Unit1": "STRIP",
              "Unit2": "Tab",
              "Conversion1": 10,
              "IsGenericNew": 1,
              "IsIngestible": 0,
              "Unit": "Tablet",
              "Size": 10,
              "PreferredSubtitute": [],
              "SubstitueBrand": [],
              "SourceProductId": "10010048",
              "FoodPreference": "",
              "ImporterName": "",
              "ImporterAddress": "",
              "GenericHBMargin": 10,
              "FSSAILicense": [],
              "PrimaryDisease": "",
              "CustHighDisc": 0,
              "OfferPrice": 0,
              "DiscountPercent": 0,
              "MinQty": 1,
              "IsOutOfStock": "Y",
              "IsCourierable": 0,
              "MRP": 0,
              "ExpiryDate": "",
              "LastMRP": 0,
              "score": 1
            }
          ],
          "LabTests": [
            {
              "ServiceId": 146,
              "ServiceName": "GLUCOSE FASTING",
              "ServiceDesc": "GLUCOSE FASTING",
              "ServicePreparation": "Over night fasting",
              "Fees": 70,
              "DiscPercent": 0,
              "OfferFees": 70,
              "IsPackage": false,
              "ServiceImage": null,
              "ServiceParam": "",
              "LabId": 3,
              "IsRptAvlOnline": true,
              "ReportPeriod": 0,
              "IsHomeCollectionAvailable": true,
              "ServiceText": null,
              "SEOServiceDesc": "Glucose is the main source of energy that is required by our body and we gain glucose from a carbohydrate-rich diet.\n\nA Fasting Blood Glucose Test helps to determine the amount of blood glucose after 8 hours of fasting and this test is the prime measure for monitoring Diabetes.",
              "TestOrderedFor": "Helps to measure the amount of glucose in body post fasting for eight hours.",
              "TestRecommended": "It is recommended to diagnose diabetes and pre-diabetes.  A high value indicates impaired Glucose tolerance, Hyperglycemia and Diabetes. A low value indicates Diabetic or Non-Diabetic hypoglycemia.",
              "TimeTaken": null,
              "TestRequiredFor": "Glucose fasting test helps to assess the amount of glucose in your blood post fasting. This test is done to check for type 1 or type 2 or gestational diabetes. It is also known as Blood Sugar or Fasting Blood Sugar.",
              "HowThePackageHelps": null,
              "SampleType": "Plasma",
              "SampleReport": "GlucoseFasting.pdf",
              "IsNABL": 2,
              "Permalink": "https://stage.sastasundar.com/test/glucose-fasting",
              "NewServiceImage": null,
              "PromoApplicable": 1,
              "PermalinkNew": "https://stage.sastasundar.com/test/glucose-fasting",
              "IsYana": 0,
              "PkgWebServiceImage": null,
              "PkgAppServiceImage": null,
              "PkgWebBannerImage": null,
              "PkgAppBannerImage": null,
              "NoOfParameters": 1,
              "ServiceDetails": null,
              "OG_Image": null,
              "SampleReportPath": ""
            },
            {
              "ServiceId": 70,
              "ServiceName": "CALCIUM",
              "ServiceDesc": "CALCIUM",
              "ServicePreparation": "No Service Preparation needed, Without tournequete",
              "Fees": 150,
              "DiscPercent": 0,
              "OfferFees": 150,
              "IsPackage": false,
              "ServiceImage": null,
              "ServiceParam": "",
              "LabId": 3,
              "IsRptAvlOnline": true,
              "ReportPeriod": 0,
              "IsHomeCollectionAvailable": true,
              "ServiceText": null,
              "SEOServiceDesc": "Serum calcium test is done to monitor the overall calcium level in the body. It determines both the total and free calcium content of the blood.",
              "TestOrderedFor": "To monitor overall levels of calcium in the body.",
              "TestRecommended": "High calcium levels mostly occurs in  Hyperparathyroidism, Sarcoidosis, Tuberculosis, HIV/AIDS and low calcium levels occur in hypoparathyroidism, vitamin D deficiency and renal failure.",
              "TimeTaken": null,
              "TestRequiredFor": "A calcium blood test determines the amount of calcium in your blood. Too much or too little calcium is detrimental to health as it paves way for several other diseases. Calcium is an important mineral, 99% of which is found in the bones and the remaining 1% circulates in the blood.",
              "HowThePackageHelps": null,
              "SampleType": "Serum",
              "SampleReport": "Calcium.pdf",
              "IsNABL": 2,
              "Permalink": "https://stage.sastasundar.com/test/calcium",
              "NewServiceImage": null,
              "PromoApplicable": 1,
              "PermalinkNew": "https://stage.sastasundar.com/test/calcium",
              "IsYana": 0,
              "PkgWebServiceImage": null,
              "PkgAppServiceImage": null,
              "PkgWebBannerImage": null,
              "PkgAppBannerImage": null,
              "NoOfParameters": 1,
              "ServiceDetails": null,
              "OG_Image": null,
              "SampleReportPath": ""
            }
          ],
          "Prescription": {},
          "DiagnosisNotes": {
            "ProvisionalDiagnosis": "",
            "FinalDiagnosis": "",
            "DoctorsAdvice": "visit after 5 days",
            "FollowUpVisitDate": null
          },
          "VCDetails": {
            "MeetingId": "bbb89c59-2249-47be-a4c8-897ac151bdf5",
            "DoctorTokenNo": "",
            "PatientTokenNo": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImEwMzc2YzFhLTdjZDgtNDhiNy04NTQ4LTI1NDY0OTE2MTI0ZCIsIm1lZXRpbmdJZCI6ImJiYjg5YzU5LTIyNDktNDdiZS1hNGM4LTg5N2FjMTUxYmRmNSIsInBhcnRpY2lwYW50SWQiOiJhYWFlNjM0ZC1kNDExLTRhMjEtYTQwMC1kY2UwODY0MzMyNDMiLCJwcmVzZXRJZCI6IjI4NWJkYmViLWFlY2ItNGVjOS1hNDk1LWQ3ZDgyN2Q0NmEyYSIsImlhdCI6MTc2Mzk3NzcxOSwiZXhwIjoxNzcyNjE3NzE5fQ.QYY5k5qR-cTJHsVGaGRG1HsC-je56yZblCwMVFcNQjrIWsyxNxOlITEYMTKyXaPinTPg3Xe7vcCArjLyBD-tQKyV8EAB7h1qfZ5pA7DCcx8OIr9zb8muSuVqYFuUCZBGBYGg7GbxQVWyYEIo5ndmvDjLeyG-in3prjlDY2jXZYw_3witOAuZR8nt6ZbZIcnFkkaMrTYBi1VTdN8p1PV6fGALElfLey1ZX1Az7ODZvSjZpKTrXedaTh-39PzpLcHjSplnPzCOhQDH4Q4uMIJ1ycg3NJv6b_o0ncqJMmkQKa9J42GMHx3cuvTPI-czlfyI5ohxY0T_TfS__YDwROz51w",
            "PatientParticipantId": "b8bf03d4-8cdf-483d-931c-ba5ad0530e8c",
            "DoctorParticipantId": "",
            "MeetingTitle": "Doctor Appointment HA-YEY4GF--",
            "VCFilePath": null,
            "IsVCJoin": null
          },
          "Settings": {
            "IsVisibleSymptoms": 1,
            "IsVisibleProvisionalDiagnosis": 1,
            "IsVisibleFinalDiagnosis": 1,
            "IsVisibleChronicDiseases": 1,
            "IsVisibleCommonAllergies": 1,
            "IsVisibleMedicalAllergies": 1,
            "IsVisibleSurgeries": 1,
            "IsVisibleMedications": 1,
            "IsVisibleLabTests": 1,
            "IsVisibleBodyVitals": 1,
            "IsVisibleChiefComplaint": 1,
            "IsVisibleDoctorAdvice": 1,
            "IsVisibleFollowupVisit": 1,
            "IsVisibleInvestigations": 1,
            "IsVisibleGenericName": 0,
            "IsVisibleExistingMedications": 1
          }
        }
      },
      "msg": "Appointment details fetched successfully"
    }

    if (res && res['status'] == 200) {
      this.apmntDetails = res['data'];
      if (res['data'].PatientVitalsInfo.ReportDocuments.length > 0) {
        res['data'].PatientVitalsInfo.ReportDocuments.forEach((d: any) => {
          this.ReportDocuments.push({ "FilePath": d.Filename })
        })
      };
      if (res['data'].PrescriptionDetails.Medicines.length > 0) {
        res['data'].PrescriptionDetails.Medicines.forEach((med: any) => {
          if (med.IsOutOfStock == 'N') {
            med.addedQty = 1;
          } else {
            med.addedQty = 0;
          }
          this.referMeds.push(med)
        })
        this.hasAddedQty()
      }
      if (res['data'].PrescriptionDetails.LabTests.length > 0) {
        res['data'].PrescriptionDetails.LabTests.forEach((lab: any) => {
          lab.selected = true;
          this.referedLabs.push(lab)
        })
      }
      this.isloading = false;
      this.spinner.hide()
    } else {
      this.apmntDetails = '';
      this.isloading = false;
      this.spinner.hide()
    }
    // })
  }

  vitalAction(event: any) {
    // console.log(event)
    if (event.type == 'edit') {
      let fd = new FormData();
      fd.append('bookingNo', event.dtls.bookingNo),
        fd.append('height', event.dtls.height),
        fd.append('bodyWeight', event.dtls.bodyWeight),
        fd.append('bodyTemp', event.dtls.bodyTemp),
        fd.append('bloodPressure', event.dtls.bloodPressure),
        fd.append('pulse', event.dtls.pulse),
        fd.append('bmi', event.dtls.bmi),
        fd.append('ChronicConditionsId', event.dtls.ChronicConditionsId),
        fd.append('CommonAllergiesId', event.dtls.CommonAllergiesId),
        fd.append('spO2', event.dtls.spO2)
      // fd.append('reportDocuments', event.data.reportDocuments)
      this.addEdit(fd)
    }
  }

  addEdit(dts: any) {
    this.spinner.show()
    this.orderService.setDetails('webapi/consultation/update_vitals', dts).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success('Record updated successfully');
        this.clsVitalMdl.nativeElement.click();
        this.getAppointmentDetails();
      } else {
        this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }

  selectPrescription(evt: any) {
    var file = evt.target.files[0];
    if (file) {

      this.infoText = '';
      let resp = this.imagesService.onSelectFile(evt, 5, this.prscFiles, this.prscImages);
      if (resp.msg == 'success') {
        this.prscFiles = resp.fileDetails;
        this.prscImages = resp.Images;
      } else {
        this.infoText = resp.msg;
        // this.open.nativeElement.click();
        alert(this.infoText)
        this.prscFiles = resp.fileDetails;
        this.prscImages = resp.Images;
      }
      // console.log(resp);
    }
  }

  delFile(img: any) {
    const index = this.prscImages.indexOf(img);
    this.prscImages.splice(index, 1);
    this.prscFiles.splice(index, 1);
  }

  uploadPrescription() {
    this.spinner.show();
    let uploadFiles: any = [];
    const formData = new FormData();
    if (this.prscFiles.length > 0) {
      uploadFiles = this.prscFiles;
      for (var i = 0; i < uploadFiles.length; i++) {
        formData.append('refFiles', uploadFiles[i]);
      }

      this.CommonService.uploadImage('jito-upload/document', formData).subscribe((res: any) => {
        if (res && (res['msgcode'] == 1)) {
          this.prscFiles = [];
          this.prscImages = [];
          this.toastr.success(res['message'])
          this.ReportDocuments.push({ "FilePath": res['data']['UploadedFileName'] })
          let fd = new FormData();
          fd.append('reportDocuments', this.ReportDocuments);
          this.addEdit(fd);
        } else {
          this.prscFiles = [];
          this.prscImages = [];
          this.toastr.error(res['message']);
          this.spinner.hide()
        }
      })
    }
  }

  removeReport(dts: any) {
    this.spinner.show()
    let fd = new FormData();
    fd.append('bookingNo', this.apmntDetails.BookingNo);
    fd.append('fileName', dts.FilePath);
    this.orderService.setDetails('webapi/consultation/remove_vital_report', dts).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success(res['message']);
        // this.clsVitalMdl.nativeElement.click();
        this.getAppointmentDetails();
      } else {
        // this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }

  joinVideocall(dts: any) {
  }

  getPrescription(dts: any) {
    if (dts.PrescriptionFileName != null && dts.PrescriptionFileName != '' && dts.PrescriptionFileName != undefined) {
      window.open(`${this.CommonService.catalogUrl}lab/prescription/download?pname=${dts.PrescriptionFileName}&BookingNo=${dts.BookingNo}`)
    }
  }

  bookLabTests() {
    this.selectedTests = this.referedLabs;
    this.addLabsMdl.nativeElement.click()
  }

  addTest(test: any) {
    this.selectedTests.push(test);
    this.referedLabs = this.referedLabs.map((obj: any) => {
      if (obj.ServiceId == test.ServiceId) {
        obj.selected = true;
      }
      return obj;
    });
  }

  removeTest(test: any) {
    this.selectedTests = this.selectedTests.filter((d: any) => d.ServiceId !== test.ServiceId);
    this.referedLabs = this.referedLabs.map((obj: any) => {
      if (obj.ServiceId == test.ServiceId) {
        obj.selected = false;
      }
      return obj;
    });
  }

  resetLabSelect() {
    this.selectedTests = [];
    this.referedLabs.forEach((ds: any) => {
      ds.selected = true;
    })
  }

  proceedLabCart() {
    if (this.selectedTests.length > 0) {
      this.spinner.show();
      this.dbService.clear('LabTests').subscribe((res: any) => {
        if (res == true) {
          this.selectedTests.forEach((productObj: any) => {
            let productId = productObj.ServiceId;
            let tmp = {
              "id": productId,
              "ProductId": productId,
              "CustUserId": this.apmntDetails.PatientId,
              "ServiceName": productObj.ServiceName,
              "Fees": productObj.Fees,
              "Discount": productObj.Discount,
              "ServiceId": productObj.ServiceId,
              "ServiceDesc": productObj.ServiceDesc,
              "ServicePreparation": productObj.ServicePreparation,
              "IsHomeCollectionAvailable": productObj.IsHomeCollectionAvailable,
              "ReportPeriod": productObj.ReportPeriod,
              "OfferFees": productObj.OfferFees,
              "DiscPercent": productObj.DiscPercent,
              "PkgServiceId": productObj.PkgServiceId,
              "PkgServicesName": productObj.PkgServicesName,
              "IsPackage": productObj.IsPackage,
              "Permalink": productObj.Permalink,
              "PromoApplicable": productObj.PromoApplicable,
              "PermalinkNew": productObj.PermalinkNew,
              "RefBookingId": this.apmntDetails.BookingNo,
            };
            this.dbService.add('LabTests', tmp).subscribe((res: any) => {
            });

          });
          let d: Date = new Date();
          this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
          this.spinner.hide();
          window.location.href = this.CommonService.baseurl + "customerlabcart";
          this.clsaddLab.nativeElement.click()
        } else {
          this.clsaddLab.nativeElement.click()
          this.spinner.hide();
          this.toastr.error('something went wrong')
        }
      })
      // console.log(res);
    }
  }

  bookMeds() {
    // this.selectedMeds = this.referMeds;
    console.log(this.referMeds)
    this.addMedsMdl.nativeElement.click()
  }

  resetMedSelect() {
    // this.selectedMeds = [];
    this.referMeds.forEach((ds: any) => {
      ds.addedQty = 1;
    })
  }

  addItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = 1;
        // this.selectedMeds.push(obj)
      }
    });
    this.hasAddedQty();
  }

  addUpdateItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = obj.addedQty + 1;
      }
    });
    this.hasAddedQty();
  }

  removeUpdateItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = obj.addedQty - 1;
      }
    })
    this.hasAddedQty();
  }

  hasAddedQty() {
    this.proceedMed = this.referMeds.some((item: any) => item.addedQty > 0);
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'C');

    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 0) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  proceedMedCart() {
    this.spinner.show();
    this.dbService.clear('cartItems').subscribe((res: any) => {
      // console.log(res);
      if (res == true) {
        this.referMeds.forEach((productObj: any) => {
          if (productObj.addedQty > 0) {

            let productId = productObj.ProductId;
            let LotId = 0;
            let CPId = 0;
            let tmp = {
              id: productId + '_' + CPId + '_' + LotId,
              ProductId: parseInt(productId),
              ProductName: productObj.DisplayName,
              CustProductName: '',
              InteractiveHealthProfileId: '',
              DosageRestriction: productObj.DosageRestriction,
              OfferPrice: productObj.OfferPrice,
              ProductCount: productObj.addedQty,
              ItemVal: productObj.OfferPrice,
              SSCurrencyValue: ".00",
              Iscourierable: productObj.IsCourierable,
              ProductImage: productObj.ProductImage,
              ProductPrice: productObj.MRP,
              // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
              PrescriptionOTC: productObj.PrescriptionOTC,
              WarehouseId: this.authService.WHId,
              CPId: 0,
              MyFamilyId: 0,
              PKLotId: LotId,
              MfgGroup: productObj.MfgGroup,
              ExpiryDate: productObj.ExpiryDate,
              ProductInteractiveModule: '',
              ProductInteractiveSubModule: '',
              IsNonReturnable: '',
              RefOrderId: productObj.RefOrderId,
              Brand: productObj.Brand,
              DiscountPercent: productObj.DiscountPercent
            };

            this.dbService.add('cartItems', tmp).subscribe((res: any) => {
            });
          }

        });
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        this.spinner.hide();
        window.location.href = this.CommonService.baseurl + "customercart";
      } else {
        this.clsaddMeds.nativeElement.click()
        this.spinner.hide();
        this.toastr.error('something went wrong')
      }
    })
  }

  getRatings() {
    // this.orderService.getDetails(`webapi/consultation/feedback_details?bookingNo=${this.bookingNo}`).subscribe((res: any) => {
    let res: any = {
      "status": 200,
      "data": {
        "BookingId": 609,
        "BookingNo": "HA-YEY4GF",
        "DoctorUserId": 51386,
        "FeedbackRating": 4,
        "FeedbackComments": "",
        "ListenedCarefully": 1,
        "ClearExplanation": 0,
        "Professional": 0,
        "PoorConnection": 0,
        "QuickResponse": 0,
        "Unprofessional": 0,
        "AdminComments": null,
        "FeedbackDate": "24 November 2025 16:49:11",
        "FeedbackStatus": "pending",
        "IsApprovedByAdmin": 0,
        "PreferredLanguage": "Hindi",
        "ConsultationMode": "Offline",
        "BookingDate": "24 November 2025 15:18:17",
        "AppointmentDate": "24 November, 2025",
        "SlotStartTime": "16:44",
        "SlotEndTime": "16:47",
        "Rating": 4,
        "BookingStatusId": 5,
        "BookingStatusDesc": "Consultation Closed",
        "CustUserId": 51513,
        "CustomerName": "suman  das",
        "PatientId": 41684,
        "PatientName": "suman das",
        "PatientMobileNo": 8000000009,
        "PatientEmailId": "",
        "PatientDOB": "28 October, 2020",
        "PatientGender": "M",
        "PatientAge": 5,
        "PatientRelationship": "Self",
        "PoorConnectionQuality": 0,
        "ProfessionalandKnowledgeable": 0,
        "UnprofessionalBehaviour": 0
      },
      "msg": "Success"
    }
    if (res && res.status == 200) {
      this.ratingRes = res
    } else {
      this.ratingRes = '';
    }
    // })

  }

  openRating(star: any) {
    console.log(this.ratingRes)
    this.inputRating = star;
    this.ratingMdl.nativeElement.click()
  }

  resetRating() {
    this.inputRating = '';
  }

  handleFeedback(payload: any) {
    console.log('Submit Payload:', payload);
    debugger
    let fd = new FormData();
    fd.append('bookingNo', payload.BookingId),
    fd.append('rating', payload.FeedbackRating),
    fd.append('comments', payload.FeedbackComments),
    fd.append('listenedCarefully', payload.ListenedCarefully),
    fd.append('clearExplanation', payload.ClearExplanation),
    fd.append('professional', payload.Professional),
    fd.append('poorConnection', payload.PoorConnection),
    fd.append('quickResponse', payload.QuickResponse),
    fd.append('unprofessionalBehaviour', payload.Unprofessional),

    this.spinner.show();
    this.orderService.setDetails('webapi/consultation/save_feedback', fd).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success(res['message']);
        this.clsrating.nativeElement.click();
        this.getRatings();
        this.spinner.hide();
      } else {
        this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }


}
