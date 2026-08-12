import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeolocationService } from '../../../services/geolocation.service';

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrl: './manage-address.component.scss'
})
export class ManageAddressComponent implements OnInit {

  AddressForm!: FormGroup;
  submitted: boolean = false;
  serviceAreaMsg: boolean = false;
  addressList: any = [];
  state_city: any = '';
  selectedAddress: any = '';
  isloading: boolean = false;
  respMsg: any = '';

  isMapSelected: boolean = false;
  isMapOpen: boolean = false;
  isGeolocationAvailable: boolean = false;

  actionType: any = 'ADD';

  @ViewChild('closebutton') closebutton: any;
  @ViewChild('addressModal') addressModal: any;
  @ViewChild('addrsRspModal') addrsRspModal: any;
  @ViewChild('AddressModal') AddressModal: any;

  constructor(
    private formBuilder: FormBuilder, 
    private profileService: ProfileService, 
    private spinner: NgxSpinnerService,
    private geolocationService: GeolocationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.generateform();
    this.getAddressList();
    this.checkGeolocationStatus();
  }

   /**
   * Check if geolocation is available
   */
  private checkGeolocationStatus(): void {
    // Subscribe to geolocation availability
    this.geolocationService.getGeolocationAvailability().subscribe(available => {
      this.isGeolocationAvailable = available;
      console.log('Geolocation available:', available);
      this.cdr.markForCheck();
    });
  }

 
  generateform() {
    this.AddressForm = this.formBuilder.group({
      AddressType: ['H', Validators.required],
      ContactPerson: ['', Validators.required],
      MobileNo: ['', Validators.required],      
      Addressline: ['', Validators.required],
      Addressline1: ['', Validators.required],
      Landmark: [''],
      Pincode: ['', Validators.required],
      // AddressName: [''],      
    })
  }

  get f() { return this.AddressForm.controls; }

  /**
   * Smart routing - Open map if available, otherwise form
   */
  openAddressEntry(): void {
    console.log('Opening address entry...');
    console.log('Geolocation available:', this.isGeolocationAvailable);
    
    if (this.isGeolocationAvailable) {
      console.log('✅ Opening map location picker');
      this.openAddressMap();
    } else {
      console.log('📝 Opening address form (geolocation disabled)');
      this.openAddressForm();
    }
  }

  /**
   * Open address form directly (when geolocation disabled or user prefers manual)
   */
  openAddressForm(): void {
    console.log('Opening address form...');
    this.actionType = 'ADD';
    this.submitted = false;
    this.state_city = '';
    this.serviceAreaMsg = false;
    this.isMapSelected = false;
    
    // Reset form with blank data
    this.AddressForm.reset();
    this.AddressForm.patchValue({
      AddressType: 'H',
    });
    
    // Re-enable all fields
    this.AddressForm.get('Addressline')?.enable();
    this.AddressForm.get('Pincode')?.enable();
    
    // Open modal
    setTimeout(() => {
      this.AddressModal.nativeElement.click();
    }, 100);
    
    this.cdr.markForCheck();
  }
  
  getAddressList(){
    this.isloading = true;
    this.spinner.show();
    // this.profileService.getAddressList('customers/address/manageAddress').subscribe((data: any) => {
    this.profileService.getAddressList('webapi/user/manageAddress').subscribe((data: any) => {
      // console.log(data['result']['rs']['allAddressData']);
      data = {"result":{"rs":{"allAddressData":[{"AddressId":3582555,"UserId":588795,"NickName":"Anindya Bhattacharya","AddressType":"H","IsPrimary":1,"Addline":"378\/1, Baidyapara, Baidyabati, West Bengal 712222, India","Landmark":"B S Park","City":"Hooghly","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":712222,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9804750934,"RecepientName":null,"AddressName":null,"Latitude":0,"Longitude":0,"AddLine1":null},{"AddressId":3582586,"UserId":588795,"NickName":"DA","AddressType":"O","IsPrimary":0,"Addline":"DH Block(Newtown), Action Area I, Newtown, Chakpachuria, New Town, West Bengal 700160","Landmark":"Candor","City":"Kolkata","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":700156,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9836370209,"RecepientName":null,"AddressName":"DA Serice","Latitude":0,"Longitude":0,"AddLine1":null},{"AddressId":3582672,"UserId":588795,"NickName":"A Bhattacharya","AddressType":"H","IsPrimary":0,"Addline":"B S PARK B S PARK, Market, Hooghly, West Bengal, India","Landmark":"null","City":"Hooghly","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":712222,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9804750934,"RecepientName":null,"AddressName":null,"Latitude":0,"Longitude":0,"AddLine1":null},{"AddressId":3582673,"UserId":588795,"NickName":"A Bhattacharya","AddressType":"H","IsPrimary":0,"Addline":"B S PARK B S PARK, Market, Hooghly, West Bengal, India","Landmark":"null","City":"Hooghly","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":712222,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9804750934,"RecepientName":null,"AddressName":null,"Latitude":0,"Longitude":0,"AddLine1":91},{"AddressId":3581129,"UserId":588795,"NickName":"Test From SS","AddressType":"O","IsPrimary":0,"Addline":"DH Block(Newtown), Action Area I, Newtown, Chakpachuria, New Town, West Bengal 700160","Landmark":"Test","City":"Others","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":37,"StateName":"Others","PinCode":712200,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":null,"IsLab":0,"CustContactNo":9836370209,"RecepientName":null,"AddressName":null,"Latitude":0,"Longitude":0,"AddLine1":null},{"AddressId":3582557,"UserId":588795,"NickName":"TEST b","AddressType":"O","IsPrimary":0,"Addline":"TEST TESTQ","Landmark":"TEST","City":"Others","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":37,"StateName":"Others","PinCode":700160,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":null,"IsLab":1,"CustContactNo":9804750934,"RecepientName":null,"AddressName":null,"Latitude":0,"Longitude":0,"AddLine1":null}],"CustomerType":"N"}}};
      if(data && data['result']['rs']['allAddressData']?.length >0){
        this.addressList = data['result']['rs']['allAddressData'];
        this.isloading = false;
        this.spinner.hide();
      }else{
        this.addressList = [];
        this.isloading = false;
        this.spinner.hide();
      }
    })
  }

   openAddressMap() {
    console.log('Opening map for address selection...');
    this.isMapOpen = true;
    this.actionType = 'ADD';
    console.log('type', this.actionType);
  }

  onLocationSelected(location: any) {
    this.selectedAddress = location;
    console.log('Selected Address:', location);
    this.isMapSelected = true;
    this.isMapOpen = false;

    // Send to backend
    this.addNewAddress2()
  }

  onMapClosed() {
     console.log('Closing map for address selection...');
    this.isMapOpen = false;
  }
  
  onSubmit() {
    this.submitted = true;
    this.respMsg = '';
    // stop here if form is invalid
    if (this.AddressForm.invalid) {
      return;
    }else if(this.serviceAreaMsg == true){      
      // alert('Service not available yet.');
      this.respMsg = 'Service not available yet.';
      this.addrsRspModal.nativeElement.click();
      return;
    }else{
      let endpoint = 'webapi/customer/saveAddress';
      let fd = new FormData();
      
      fd.append('NickName', this.AddressForm.value.ContactPerson);
      fd.append('Addline', this.AddressForm.value.Addressline);
      fd.append('Addline1', this.AddressForm.value.Addressline1);
      fd.append('AddressType', this.AddressForm.value.AddressType);
      fd.append('Landmark', this.AddressForm.value.Landmark);
      fd.append('PinCode', this.AddressForm.value.Pincode);
      fd.append('CustContactNo', this.AddressForm.value.MobileNo);
      
      if(this.actionType == 'EDIT'){
        fd.append('AddressId', this.selectedAddress.AddressId);
        // 'customers/address/editAddress'
        endpoint = 'webapi/customer/editAddress';
      }
      // console.log(this.AddressForm.value, fd);
      this.spinner.show();
      // this.profileService.saveNewAddress('customers/address/saveAddress', fd).subscribe((res: any) => {
      this.profileService.addEditAddress(endpoint, fd).subscribe((res: any) => {
        // console.log(res);
        this.spinner.hide();
        if(res && res['status']==200){
          this.getAddressList();
          // this.closebutton.nativeElement.click();
          this.respMsg = res['Message'];
          this.addrsRspModal.nativeElement.click();
          this.onReset();
        }else{
          // alert('some thing went wrong. please try again');
          // this.closebutton.nativeElement.click();
          this.respMsg = res['Message'];
          this.addrsRspModal.nativeElement.click();
          this.onReset();
        }     
      })
    }
  }

  onReset() {
    this.submitted = false;
    this.AddressForm.reset();
    this.state_city = '';
    this.serviceAreaMsg = false;
    // this.respMsg = '';
    this.AddressForm.patchValue({
      AddressType: 'H',
      // AddressName: ''
    });
  }

  setValue(e: any){
    // if(e.target.value != 'T'){
    //   this.AddressForm.patchValue({
    //     AddressName: ''
    //   });
    // }
  }

  changeLocation(){
    console.log('type', this.actionType);
    // this.onReset();
    // this.closebutton.nativeElement.click();
    // this.openAddressMap();
    this.isMapOpen = true;
    this.closebutton.nativeElement.click(); 
    // this.AddressForm.patchValue({
    //   AddressType: 'H',
    //   Addressline: this.selectedAddress.addresss,
    //   Pincode: this.selectedAddress.pincode,
    // });
    // this.AddressForm.get('Addressline')?.disable();
    // this.AddressForm.get('Pincode')?.disable();
    // this.isMapSelected = true;
    // this.AddressModal.nativeElement.click();

  }
  addNewAddress2(){
    // this.actionType = 'ADD';
    // this.AddressForm.reset();
    // this.selectedAddress = adr;
    this.AddressForm.patchValue({
      AddressType: 'H',
      // ContactPerson: adr.NickName,
      // MobileNo: adr.CustContactNo,
      Addressline: this.selectedAddress.addresss,
      // Landmark: adr.Landmark,
      Pincode: this.selectedAddress.pincode,
    });
    this.isMapSelected = true;
    // this.AddressForm.get('Addressline')?.disable();
    // this.AddressForm.get('Pincode')?.disable();
    this.AddressModal.nativeElement.click();
  }

  addNewAddress(){
    this.actionType = 'ADD';
    this.onReset();
    this.AddressModal.nativeElement.click();
  }

  setEditModal(adr: any){
    console.log('edit');
    this.actionType = 'EDIT';
    this.AddressForm.reset();
    this.selectedAddress = adr;
    this.isMapSelected = true;

    this.AddressForm.patchValue({
      AddressType: adr.AddressType,
      ContactPerson: adr.NickName,
      MobileNo: adr.CustContactNo,
      Addressline: adr.Addline,
      Addressline1: adr.AddLine1,
      Landmark: (adr.Landmark && adr.Landmark !== 'null') ? adr.Landmark : '',
      Pincode: adr.PinCode,
    });
    // this.AddressForm.get('Addressline')?.disable();
    // this.AddressForm.get('Pincode')?.disable();
    this.AddressModal.nativeElement.click();
  }

  editAddress(){
    // this.qService.editQue([params["id"]]).subscribe(res => {
    //   this.question = res;
      // this.AddressForm.patchValue({
      //   AddressType: ['2'],
      //   ContactPerson: ['Avik Sarkar'],
      //   MobileNo: ['7003477290'],      
      //   Addressline: ['R N Road Dumdum, kolkata, West Bengal'],
      //   Landmark: ['Milan Sangha Club'],
      //   Pincode: ['700156'],
      // });
    // });

    // this.profileService.editAddress('customers/address/editAddress', fd).subscribe((res: any) => {
    //   console.log(res);
    // this.getAddressList();
    // this.closebutton.nativeElement.click();
    // })
  }

  checkServiceArea() {
    this.state_city = '';
    this.serviceAreaMsg = false;
    // console.log(this.AddressForm.value.Pincode, this.state_city);
    let checkPin = this.AddressForm.value.Pincode;
    if (this.AddressForm.value.Pincode.length == 6) {
      let fd = new FormData();
      fd.append('pincode', checkPin);
      this.spinner.show();
      this.profileService.checkServiceArea('webapi/cartuserapp/get_nearest_area', fd).subscribe((res: any) => {

        // console.log(res);
        this.spinner.hide();
        if(res && res['status'] == 'success'){
          this.state_city = res['state_city'];
          // console.log(this.state_city);
        }else{
          this.state_city = 'Service not available yet.';
          this.serviceAreaMsg = true;
        }
      })
    }
  }

  setPrimaryAddress(adrId: any){
    let fd = new FormData();
    fd.append('addressid', adrId);
    // console.log(adrId,fd);
    // this.profileService.setDefaultAddress('customers/address/changePrimaryAddress', fd).subscribe((res: any) => {
    this.profileService.setDefaultAddress('webapi/customer/changePrimaryAddress', fd).subscribe((res: any) => {
      // console.log(res);
      if(res && res['status']==200){
        this.closebutton.nativeElement.click();
        this.getAddressList();
        this.respMsg = 'Selected address set as primary';
        this.addrsRspModal.nativeElement.click();
      }else{
        this.respMsg = 'Unable to process your request, please try after some time';
        this.addrsRspModal.nativeElement.click();
      }
    })
  }

  setDeleteModal(address: any){
    this.selectedAddress = address;
  }

  removeAddress(adrId: any){
    this.respMsg = '';
    let fd = new FormData();
    fd.append('addressid', adrId);
    // console.log(adrId,fd);
    this.spinner.show();
    // this.profileService.removeAddress('customers/address/deleteAddress', fd).subscribe((res: any) => {
    this.profileService.removeAddress('webapi/customer/deleteAddress', fd).subscribe((res: any) => {
      // console.log(res);
      if(res && res['status']==200){
        this.getAddressList();
        this.respMsg = 'Address deleted successfully';
        this.addrsRspModal.nativeElement.click();
        this.selectedAddress = '';
      }else{
        this.respMsg = 'Unable to process your request, please try after some time';
        this.addrsRspModal.nativeElement.click();
        this.selectedAddress = '';
      }
    })
  }

  numCheck(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

  alphaOnly(event: any) {
    return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))
  };
}
