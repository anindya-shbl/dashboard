import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-buy-again',
  templateUrl: './buy-again.component.html',
  styleUrl: './buy-again.component.scss'
})
export class BuyAgainComponent implements OnInit {

  constructor(
    public CommonService: CommonService, 
    private orderService : OrderService, 
    private authService: AuthService, 
    private dbService: NgxIndexedDBService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService
  ){}

  buyAgainList : any= [];
  selectedTab: any = 'patient';
  respMsg: any = '';
  isResp: boolean = false; 

  @ViewChild('buyagainModal') buyagainModal: any;
  // @Output() newItemEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.isResp = false;
    this.recenrOrders();
  }

  recenrOrders(){
    this.spinner.show();
    this.buyAgainList = []; 
    this.orderService.getBuyAgainList('webapi/order/reOrderList').subscribe((res: any) => {
      res = {"data":{"PatientmedorderList":[{"MyFamilyId":1245357,"PatientName":"Anindya Bhattacharya","LastOrderId":101001982924,"LastOrderLatestDate":"2025-12-15 00:00:00","ItemList":[{"OrderId":101001982926,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":172645,"SltProdCategory":null,"SourceProductId":10002044,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":151.88,"DisplayName":"Cansoft CL Suppositories (3 Suppositories)","ProductName":"Cansoft CL","ProductImage":"cansoft-cl-1406055628-10002044.JPG","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982926,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":124.54,"EncodeProdId":"8ttgal","CustomProductName":"","Brand":"Sun Pharma Laboratories Ltd.","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2027-12-31","Salts":{"NameSearch":"clindamycin + clotrimazole","SaltStrengthRaw":"Clindamycin 100mg + Clotrimazole 200mg","SaltSchedule":"H","SaltStrength":"CLINDAMYCIN100MGCLOTRIMAZOLE200MG","Id":1222,"Code":"SN01549","Name":"Clindamycin + Clotrimazole","SaltCategory":""},"MfgGroup":"Sun Pharma Laboratories Ltd."},{"OrderId":101001982924,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":175177,"SltProdCategory":null,"SourceProductId":10003787,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":203.4,"DisplayName":"Satrogyl O Tablet (10 Tab)","ProductName":"Satrogyl O","ProductImage":"Satrogyl-O-1565680184-10003787-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982924,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":166.79,"EncodeProdId":"jtvhkq","CustomProductName":"","Brand":"Alkem Laboratories Ltd. (m)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2029-01-31","Salts":{"NameSearch":"ofloxacin + satranidazole","SaltStrengthRaw":"Ofloxacin 200mg + Satranidazole 300mg","SaltSchedule":"H","SaltStrength":"OFLOXACIN200MGSATRANIDAZOLE300MG","Id":1772,"Code":"SN1926","Name":"Ofloxacin + Satranidazole","SaltCategory":""},"MfgGroup":"Alkem Laboratories Ltd. (M)"},{"OrderId":101001982925,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":176160,"SltProdCategory":null,"SourceProductId":10005719,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":275,"DisplayName":"Zerodol TH 4 mg Tablet (10 Tab)","ProductName":"Zerodol TH","ProductImage":"Zerodol-TH-1697266289-10005719-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982925,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":225.5,"EncodeProdId":"mbddrh","CustomProductName":"","Brand":"Ipca Laboratories Ltd.(d)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2028-12-31","Salts":{"NameSearch":"aceclofenac + thiocolchicoside","SaltStrengthRaw":"Aceclofenac 100mg + Thiocolchicoside 4mg","SaltSchedule":"H","SaltStrength":"ACECLOFENAC100MGTHIOCOLCHICOSIDE4MG","Id":1399,"Code":"SN01729","Name":"Aceclofenac + Thiocolchicoside","SaltCategory":""},"MfgGroup":"Ipca Laboratories Ltd.(D)"}],"ItemListOFS":[]}],"otcHouseHoldList":[],"orderIDList":[{"OrderId":101001982926,"ItemList":[{"OrderId":101001982926,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":172645,"SltProdCategory":null,"SourceProductId":10002044,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":151.88,"DisplayName":"Cansoft CL Suppositories (3 Suppositories)","ProductName":"Cansoft CL","ProductImage":"cansoft-cl-1406055628-10002044.JPG","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982926,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":124.54,"EncodeProdId":"8ttgal","CustomProductName":"","Brand":"Sun Pharma Laboratories Ltd.","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2027-12-31","Salts":{"NameSearch":"clindamycin + clotrimazole","SaltStrengthRaw":"Clindamycin 100mg + Clotrimazole 200mg","SaltSchedule":"H","SaltStrength":"CLINDAMYCIN100MGCLOTRIMAZOLE200MG","Id":1222,"Code":"SN01549","Name":"Clindamycin + Clotrimazole","SaltCategory":""},"MfgGroup":"Sun Pharma Laboratories Ltd."}]},{"OrderId":101001982925,"ItemList":[{"OrderId":101001982925,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":176160,"SltProdCategory":null,"SourceProductId":10005719,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":275,"DisplayName":"Zerodol TH 4 mg Tablet (10 Tab)","ProductName":"Zerodol TH","ProductImage":"Zerodol-TH-1697266289-10005719-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982925,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":225.5,"EncodeProdId":"mbddrh","CustomProductName":"","Brand":"Ipca Laboratories Ltd.(d)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2028-12-31","Salts":{"NameSearch":"aceclofenac + thiocolchicoside","SaltStrengthRaw":"Aceclofenac 100mg + Thiocolchicoside 4mg","SaltSchedule":"H","SaltStrength":"ACECLOFENAC100MGTHIOCOLCHICOSIDE4MG","Id":1399,"Code":"SN01729","Name":"Aceclofenac + Thiocolchicoside","SaltCategory":""},"MfgGroup":"Ipca Laboratories Ltd.(D)"}]},{"OrderId":101001982924,"ItemList":[{"OrderId":101001982924,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":175177,"SltProdCategory":null,"SourceProductId":10003787,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":203.4,"DisplayName":"Satrogyl O Tablet (10 Tab)","ProductName":"Satrogyl O","ProductImage":"Satrogyl-O-1565680184-10003787-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982924,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":166.79,"EncodeProdId":"jtvhkq","CustomProductName":"","Brand":"Alkem Laboratories Ltd. (m)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2029-01-31","Salts":{"NameSearch":"ofloxacin + satranidazole","SaltStrengthRaw":"Ofloxacin 200mg + Satranidazole 300mg","SaltSchedule":"H","SaltStrength":"OFLOXACIN200MGSATRANIDAZOLE300MG","Id":1772,"Code":"SN1926","Name":"Ofloxacin + Satranidazole","SaltCategory":""},"MfgGroup":"Alkem Laboratories Ltd. (M)"}]}],"ProductList":[{"OrderId":101001982926,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":172645,"SltProdCategory":null,"SourceProductId":10002044,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":151.88,"DisplayName":"Cansoft CL Suppositories (3 Suppositories)","ProductName":"Cansoft CL","ProductImage":"cansoft-cl-1406055628-10002044.JPG","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982926,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":124.54,"EncodeProdId":"8ttgal","CustomProductName":"","Brand":"Sun Pharma Laboratories Ltd.","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2027-12-31","Salts":{"NameSearch":"clindamycin + clotrimazole","SaltStrengthRaw":"Clindamycin 100mg + Clotrimazole 200mg","SaltSchedule":"H","SaltStrength":"CLINDAMYCIN100MGCLOTRIMAZOLE200MG","Id":1222,"Code":"SN01549","Name":"Clindamycin + Clotrimazole","SaltCategory":""},"MfgGroup":"Sun Pharma Laboratories Ltd."},{"OrderId":101001982925,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":176160,"SltProdCategory":null,"SourceProductId":10005719,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":275,"DisplayName":"Zerodol TH 4 mg Tablet (10 Tab)","ProductName":"Zerodol TH","ProductImage":"Zerodol-TH-1697266289-10005719-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982925,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":225.5,"EncodeProdId":"mbddrh","CustomProductName":"","Brand":"Ipca Laboratories Ltd.(d)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2028-12-31","Salts":{"NameSearch":"aceclofenac + thiocolchicoside","SaltStrengthRaw":"Aceclofenac 100mg + Thiocolchicoside 4mg","SaltSchedule":"H","SaltStrength":"ACECLOFENAC100MGTHIOCOLCHICOSIDE4MG","Id":1399,"Code":"SN01729","Name":"Aceclofenac + Thiocolchicoside","SaltCategory":""},"MfgGroup":"Ipca Laboratories Ltd.(D)"},{"OrderId":101001982924,"OrderType":"P","OrderDate":"2025-12-15 00:00:00","CustUserId":800027,"ItemQuantity":1,"MyFamilyId":1245357,"ProductId":175177,"SltProdCategory":null,"SourceProductId":10003787,"IsPrescriptionUploaded":0,"PatientName":"Anindya Bhattacharya","PrescriptionOTC":"P","MRP":203.4,"DisplayName":"Satrogyl O Tablet (10 Tab)","ProductName":"Satrogyl O","ProductImage":"Satrogyl-O-1565680184-10003787-1.jpg","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101001982924,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":1,"IsOutOfStock":"N","DiscountPercent":18,"OfferPrice":166.79,"EncodeProdId":"jtvhkq","CustomProductName":"","Brand":"Alkem Laboratories Ltd. (m)","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2029-01-31","Salts":{"NameSearch":"ofloxacin + satranidazole","SaltStrengthRaw":"Ofloxacin 200mg + Satranidazole 300mg","SaltSchedule":"H","SaltStrength":"OFLOXACIN200MGSATRANIDAZOLE300MG","Id":1772,"Code":"SN1926","Name":"Ofloxacin + Satranidazole","SaltCategory":""},"MfgGroup":"Alkem Laboratories Ltd. (M)"}]},"message":null,"response_code":0};
    //   console.log('reorder list', res);
      if(res && res['response_code']==0){
        this.buyAgainList.push(res);
        this.isResp = true;
        this.spinner.hide();
      }else{
        this.isResp = true;
        this.spinner.hide();
      }
    })
  }

  showTab(tab: any){
    this.selectedTab = tab;
  }


  proceed_buyAgain(evnt: any){
    let reorderItems : any = evnt;
    // console.log('checkout', reorderItems);
    // debugger
    this.spinner.show();
    this.dbService.clear('cartItems').subscribe((res: any) => {
      // console.log(res);
      if (res == true) {
        reorderItems.forEach((productObj: any) => {

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
            // console.log('Record added successfully.', res);
          });

        });
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        window.location.href=this.CommonService.baseurl +"customercart";
      }else{
        this.spinner.hide();
        alert('something went wrong')
      }
    })
  }

}