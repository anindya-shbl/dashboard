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
  // coordinates to pass to map when opening for edit
  editLatitude: number = 0;
  editLongitude: number = 0;
  existingAddress: any = null; // To pass existing address to map component for editing
  // When true, skip resetting the form when modal is programmatically closed
  skipResetOnClose: boolean = false;

  actionType: any = 'ADD';

  isEnablingGeolocation: boolean = false;
  geolocationMessage: string = '';
  geolocationMessageType: 'success' | 'error' | 'info' = 'info';


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
    // this.checkGeolocationStatus();
  }

   /**
   * Check if geolocation is available
   */
  private checkGeolocationStatus(): void {
    // Subscribe to geolocation availability
    this.geolocationService.getGeolocationAvailability().subscribe(available => {
      this.isGeolocationAvailable = available;
      console.log('Geolocation status updated:', available);
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
   * Request location permission only when the user clicks Add New Address.
   */
  openAddressEntry(): void {
    console.log('Opening address entry...');
    this.respMsg = '';

    this.geolocationService.verifyGeolocationStatus().subscribe(available => {
      if (available) {
        console.log('✅ Geolocation permission granted, opening map');
        this.openAddressMap();
      } else {
        console.log('⛔ Geolocation permission denied or unavailable, opening manual form');
        this.openAddressForm();
      }
    });
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
      data = {"result":{"rs":{"allAddressData":[{"AddressId":3582863,"UserId":588795,"NickName":"A Bhattacharya","AddressType":"H","IsPrimary":0,"Addline":"B S PARK, Grand Trunk Road, Market, Baidyabati, West Bengal, India","Landmark":"B S PARK GROUND","City":"Hooghly","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":712222,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9836370209,"RecepientName":null,"AddressName":null,"Latitude":22.783745099999997,"Longitude":88.322468,"AddLine1":"91-3 J N GUPTA LANE"},{"AddressId":3582871,"UserId":588795,"NickName":"A Bhattacharya","AddressType":"H","IsPrimary":0,"Addline":"Baidyabati Charushila Bose Balika Vidyalaya, Baidyapara, Baidyabati, West Bengal, India","Landmark":"Girl's School","City":"Hooghly","AreaId":null,"ServiceArea":null,"FamilyId":null,"StateId":35,"StateName":"West Bengal","PinCode":712222,"CountryId":1,"CountryName":"India","IsDeleted":0,"WarehouseId":1,"MedDiscPercent":18,"IsLab":1,"CustContactNo":9804750934,"RecepientName":null,"AddressName":null,"Latitude":22.781874500000004,"Longitude":88.3240828,"AddLine1":"91-3 J N GUPTA LANE"}],"CustomerType":"N"}}};
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
    // If editing an existing address, preserve its AddressId and other fields
    if (this.actionType === 'EDIT' && this.selectedAddress && this.selectedAddress.AddressId) {
      const addressId = this.selectedAddress.AddressId;
      // merge new location into existing selectedAddress while keeping AddressId
      this.selectedAddress = Object.assign({}, this.selectedAddress, location, { AddressId: addressId });
    } else {
      this.selectedAddress = location;
    }

    console.log('From onLocationSelected method:', this.selectedAddress);
    this.isMapSelected = true;
    this.isMapOpen = false;

    // Send to backend (or open form)
    this.addNewAddress2();
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
      fd.append('latitude', this.selectedAddress.latitude);
      fd.append('longitude', this.selectedAddress.longitude);

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
    // If a programmatic close asked to skip reset (e.g. opening map), honor it
    if (this.skipResetOnClose) {
      this.skipResetOnClose = false;
      this.submitted = false;
      return;
    }

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
    console.log('changeLocation, type', this.actionType);

    const adr = this.selectedAddress || {};
    const latVal = adr.Latitude ?? adr.latitude ?? 0;
    const lngVal = adr.Longitude ?? adr.longitude ?? 0;
    const hasCoords = latVal && lngVal && latVal !== 0 && lngVal !== 0;

    const openMapCentered = (lat: number, lng: number) => {
      this.editLatitude = lat;
      this.editLongitude = lng;
      // avoid resetting the form when closing modal for map selection
      this.skipResetOnClose = true;
      try { this.closebutton.nativeElement.click(); } catch (e) {}
      setTimeout(() => { this.isMapOpen = true; }, 150);
    };

    if (hasCoords) {
      if (this.isGeolocationAvailable) {
        openMapCentered(latVal, lngVal);
        return;
      }

      this.isEnablingGeolocation = true;
      this.geolocationService.requestGeolocationPermission().subscribe({
        next: (response) => {
          this.isEnablingGeolocation = false;
          if (response.success) {
            this.isGeolocationAvailable = true;
            openMapCentered(latVal, lngVal);
          } else {
            this.AddressModal.nativeElement.click();
          }
        },
        error: () => {
          this.isEnablingGeolocation = false;
          this.AddressModal.nativeElement.click();
        }
      });
      return;
    }

    if (this.isGeolocationAvailable) {
      const cur = this.geolocationService.getCurrentLocationSync();
      if (cur && cur.latitude && cur.longitude) {
        openMapCentered(cur.latitude, cur.longitude);
        return;
      }
      try { this.closebutton.nativeElement.click(); } catch (e) {}
      setTimeout(() => { this.isMapOpen = true; }, 150);
      return;
    }

    this.isEnablingGeolocation = true;
    this.geolocationService.requestGeolocationPermission().subscribe({
      next: (response) => {
        this.isEnablingGeolocation = false;
        if (response.success && response.location) {
          openMapCentered(response.location.latitude, response.location.longitude);
        } else {
          this.AddressModal.nativeElement.click();
        }
      },
      error: () => {
        this.isEnablingGeolocation = false;
        this.AddressModal.nativeElement.click();
      }
    });

  }
  addNewAddress2(){
    // this.actionType = 'ADD';
    // this.AddressForm.reset();
    // this.selectedAddress = adr;
    this.AddressForm.patchValue({
      AddressType: 'H',
      // ContactPerson: adr.NickName,
      // MobileNo: adr.CustContactNo,
      // Addressline: this.selectedAddress.addresss,
      Addressline: this.selectedAddress.formatted_address,
      latitude: this.selectedAddress.latitude,
      longitude: this.selectedAddress.longitude,
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
    this.checkGeolocationStatus();
    // console.log('From setEditModal method', adr);
    this.existingAddress = adr; // Pass existing address to map component
    this.actionType = 'EDIT';
    // console.log('From setEditModal method AddressForm', this.AddressForm);
    // this.AddressForm.reset();
    this.selectedAddress = adr;
    // console.log('From setEditModal method selectedAddress', this.selectedAddress);
    // Determine if this address has coordinates we can use for map editing
    const hasCoords = adr && adr.Latitude && adr.Longitude && adr.Latitude !== 0 && adr.Longitude !== 0;

    // Helper to prefill form values
    const prefillForm = () => {
      this.AddressForm.patchValue({
        AddressType: adr.AddressType,
        ContactPerson: adr.NickName,
        MobileNo: adr.CustContactNo,
        Addressline: adr.Addline,
        Addressline1: adr.AddLine1,
        Landmark: (adr.Landmark && adr.Landmark !== 'null') ? adr.Landmark : '',
        Pincode: adr.PinCode,
      });
    };

    this.geolocationService.verifyGeolocationStatus().subscribe({
      next: (isAvailable) => {
      // this.isCheckingGeoLocation = false;
      this.isGeolocationAvailable = isAvailable;
      if (hasCoords && isAvailable) {
          // If geolocation is already available, open map centered on existing coords
          if (this.isGeolocationAvailable) {
            this.editLatitude = adr.Latitude;
            this.editLongitude = adr.Longitude;
            prefillForm();
            this.isMapOpen = true;
            return;
          }
        } else if (hasCoords && !isAvailable) {
           // Otherwise, request permission explicitly when user clicks Edit
          this.isEnablingGeolocation = true;
          this.geolocationService.requestGeolocationPermission().subscribe({
            next: (response) => {
              this.isEnablingGeolocation = false;
              if (response.success) {
                // Permission granted -> open map at address coords
                this.isGeolocationAvailable = true;
                this.editLatitude = adr.Latitude;
                this.editLongitude = adr.Longitude;
                prefillForm();
                this.isMapOpen = true;
              } else {
                // Permission denied or unavailable -> open edit form modal
                prefillForm();
                this.AddressModal.nativeElement.click();
              }
            },
            error: () => {
              this.isEnablingGeolocation = false;
              prefillForm();
              this.AddressModal.nativeElement.click();
            }
          });
        }
        else {
          // No coords available for this address - open edit form modal
          prefillForm();
          this.AddressModal.nativeElement.click();
        }
      },
      error: (error) => {
        // this.isCheckingGeoLocation = false;
        console.error('Error verifying geolocation:', error);
        // On error, just open form
        prefillForm();
        this.AddressModal.nativeElement.click();
        this.isGeolocationAvailable = false;
        this.cdr.markForCheck();
      }
    });
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

  /**
 * Request geolocation permission
 */
  enableGeolocation(): void {
    console.log('Requesting geolocation permission...');
    this.isEnablingGeolocation = true;
    this.geolocationMessage = '';

    this.geolocationService.requestGeolocationPermission().subscribe({
      next: (response) => {
        this.isEnablingGeolocation = false;

        if (response.success) {
          console.log('✅ Geolocation enabled:', response.location);
          this.geolocationMessage = response.message;
          this.geolocationMessageType = 'success';
          
          // Automatically open map for address selection
          setTimeout(() => {
            this.openAddressMap();
            this.closebutton.nativeElement.click(); 
            this.geolocationMessage = '';
          }, 1500);
        } else {
          console.warn('❌ Geolocation request failed:', response.message);
          this.geolocationMessage = response.message;
          this.geolocationMessageType = 'error';
        }

        this.cdr.markForCheck();
      }
    });
  }

/**
 * Dismiss geolocation message
 */
  dismissGeolocationMessage(): void {
    this.geolocationMessage = '';
  }

  formatAddress(adr: any): string {
    const addressParts = [
      adr?.AddLine1,
      adr?.Landmark,
      adr?.Addline,
      adr?.City
    ].filter(part => part !== null && part !== undefined && String(part).trim() !== '');

    const locationParts = [
      adr?.StateName ? `(${adr.StateName})` : '',
      adr?.PinCode ? `${adr.PinCode}` : ''
    ].filter(part => part !== null && part !== undefined && String(part).trim() !== '');

    return [...addressParts, ...locationParts].join(', ');
  }
}
