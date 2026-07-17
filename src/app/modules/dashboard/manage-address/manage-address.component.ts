import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string = '';
  isLoadingLocation: boolean = false;

  actionType: any = 'ADD';
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('addressModal') addressModal: any;
  @ViewChild('addrsRspModal') addrsRspModal: any;
  @ViewChild('AddressModal') AddressModal: any;

  constructor(private formBuilder: FormBuilder, private profileService: ProfileService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.generateform();
    this.getAddressList();
  }

  generateform() {
    this.AddressForm = this.formBuilder.group({
      AddressType: ['H', Validators.required],
      ContactPerson: ['', Validators.required],
      MobileNo: ['', Validators.required],      
      Addressline: ['', Validators.required],
      Landmark: [''],
      Pincode: ['', Validators.required],
      // AddressName: [''],      
    })
  }

  get f() { return this.AddressForm.controls; }

  getAddressList(){
    this.isloading = true;
    this.spinner.show();
    // this.profileService.getAddressList('customers/address/manageAddress').subscribe((data: any) => {
    this.profileService.getAddressList('webapi/user/manageAddress').subscribe((data: any) => {
      // console.log(data['result']['rs']['allAddressData']);
      // || treats empty string, 0, and false as “falsy” and replaces them
      // ?? only replaces null or undefined
      // ?. is optional chaining operator, it returns undefined if the property does not exist
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
      let fd = new FormData();
      fd.append('NickName', this.AddressForm.value.ContactPerson);
      fd.append('Addline', this.AddressForm.value.Addressline);
      fd.append('AddressType', this.AddressForm.value.AddressType);
      fd.append('Landmark', this.AddressForm.value.Landmark);
      fd.append('PinCode', this.AddressForm.value.Pincode);
      fd.append('CustContactNo', this.AddressForm.value.MobileNo);
      
      if(this.actionType == 'EDIT'){
        fd.append('AddressId', this.selectedAddress.AddressId);
      }
      // console.log(this.AddressForm.value, fd);
      this.spinner.show();

      // this.profileService.saveNewAddress('customers/address/saveAddress', fd).subscribe((res: any) => {
      this.profileService.saveNewAddress('webapi/customer/saveAddress', fd).subscribe((res: any) => {
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

  useCurrentLocation(){
    this.isLoadingLocation = true;
    this.locationError = '';

    // Check if Geolocation API is available
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your browser';
      this.isLoadingLocation = false;
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('Location:', this.latitude, this.longitude);
        this.isLoadingLocation = false;
        
        // Optional: Call your service to save location
        // this.dashboardService.saveLocation(this.latitude, this.longitude);
      },
      (error) => {
        // Error callback
        this.isLoadingLocation = false;
        this.handleLocationError(error);
      },
      {
        enableHighAccuracy: true,  // Get more precise location
        timeout: 10000,            // Wait max 10 seconds
        maximumAge: 0              // Don't use cached position
      }
    );
  }

  private handleLocationError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.locationError = 'Permission denied. Enable location in browser settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.locationError = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        this.locationError = 'The request to get user location timed out.';
        break;
      default:
        this.locationError = 'An unknown error occurred while retrieving location.';
    }
  }

  addNewAddress(){
    this.actionType = 'ADD';
    this.onReset();
    this.AddressModal.nativeElement.click();
  }

  setEditModal(adr: any){
    this.actionType = 'EDIT';
    this.AddressForm.reset();
    this.selectedAddress = adr;
    this.AddressForm.patchValue({
      AddressType: adr.AddressType,
      ContactPerson: adr.NickName,
      MobileNo: adr.CustContactNo,
      Addressline: adr.Addline,
      Landmark: adr.Landmark,
      Pincode: adr.PinCode,
    });
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
