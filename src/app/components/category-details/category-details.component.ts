import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../services/web-engage.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit {

  pageNo: any = 1;
  pageSize: any = 50;
  totalcount: any = 0;
  isLoading: boolean = true
  ctName: any = '';
  segment: any = '';
  type: any = '';
  encodedId: any = '';
  categoryNow: any = [];
  filterId: any = 0;
  tabList: any = [];
  filterPanel: any = [];
  brands: any = [];
  priceRange: any = [];
  addedInCart: any = [];
  searchList: any = [];
  selectedMfg: any = [];
  selectedPrice: any = [];
  subscription: Subscription;
  categorySub!: Subscription;
  addEvntScription!: Subscription;
  ctgryList: any = [];
  sortOptions = [
    { label: 'Select', sortby: '', sortorder: '' },
    { label: 'Max Discount %', sortby: 'DiscountPercent', sortorder: 'desc' },
    { label: 'Price (Low to High)', sortby: 'OfferPrice', sortorder: 'asc' },
    { label: 'Price (High to Low)', sortby: 'OfferPrice', sortorder: 'desc' },
    { label: 'Relevance', sortby: 'relevance', sortorder: 'desc' },
  ];

  selectedSort = this.sortOptions[0];


  constructor(
    private activeRoute: ActivatedRoute,
    public authService: AuthService,
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // if (router.navigated) {
        this.pageLoad()
        // }
      }
    });
    this.addEvntScription = this.CommonService.getClickEvent().subscribe(() => {
      this.updatefromSearch();

    })
  }

  ngOnInit(): void { }

  pageLoad(): void {
    this.spinner.show();
    this.selectedSort = this.sortOptions[0];
    this.resetpage();
    window.scrollTo(0, 0);
    this.ctName = this.activeRoute.snapshot.paramMap.get('name');
    this.segment = this.activeRoute.snapshot.paramMap.get('seg');
    this.type = this.activeRoute.snapshot.paramMap.get('typ');
    this.encodedId = this.activeRoute.snapshot.paramMap.get('ctId');
    if ((this.ctName != null && this.ctName != '' && this.ctName != undefined) &&
      (this.encodedId != null && this.encodedId != '' && this.encodedId != undefined)) {
      // this.getTabList()
      this.categorySub = this.authService.CategoryList$.subscribe(categories => {
        this.ctgryList = categories;
        if (this.ctgryList.length > 0) {
          this.getAllRecord();
          this.setCurrentCategory()
        }
      });
    } else {
      this.spinner.hide();
      this.router.navigate(['/category/listing'])
    }
  }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
    });
  }

  setCurrentCategory() {
    if (this.type == 'm') {
      this.categoryNow = this.ctgryList.filter((item: any) => item.EncodeCatId === this.encodedId);
      if (this.categoryNow.length > 0 && this.categoryNow[0].subcategory_data && this.categoryNow[0].subcategory_data.length > 0) {
        this.filterId = this.categoryNow[0].subcategory_data[0].CategoryId;
        this.tabList = this.categoryNow[0].subcategory_data;
        if (this.filterId > 0) {
          this.getFilterPanel();
          this.getProductsDetails()
        }
      }

    } else if (this.type == 's') {
      this.ctgryList.forEach((element: any) => {
        if (element.subcategory_data && element.subcategory_data.length > 0) {
          let ctn = element.subcategory_data.filter((item: any) => item.EncodeCatId === this.encodedId);
          if (ctn.length > 0) {
            this.getTabList(ctn);
          }
        }
      });

    }

  }

  getTabList(ctn: any) {
    let listdata = {
      warehouseId: this.authService.WHId,
      pincode: this.authService.PinCode,
      panindia: this.authService.IsPanIndia,
      categoryLevel: 3,
      categoryId: ctn[0].ParentEncodeCatId,
      ci_csrf_token: ''
    }
    this.authService.getCategoryDetails('category/getcategorylist', listdata).subscribe((data: any) => {
      if (data && data.msgcode == 1) {
        // console.log(data);
        this.tabList = data.results;
      }

      this.categoryNow = ctn;
      this.filterId = this.categoryNow[0].CategoryId;
      this.getFilterPanel();
      this.getProductsDetails()
    })
    // console.log(this.categoryNow);
  }

  getFilterPanel() {
    this.filterPanel = [];
    let timenow = new Date().getTime();
    let url = `${this.CommonService.searchBaseUrl}filter_panel?category_id=${this.filterId}&panindia=${this.authService.IsPanIndia}&wh=${this.authService.WHId}&device=1&pincode=${this.authService.PinCode}&ci_csrf_token=&_=${timenow}`;
    this.CommonService.getSearchData(url).subscribe((res: any) => {
      if (res && res.items && Object.keys(res.items).length > 0) {
        this.filterPanel.push(res.items);

        this.priceRange = this.createPriceRanges(res.items.PriceMin, res.items.PriceMax);
        this.brands = res.items.Brand;
        if (this.brands && this.brands.length > 0) {
          this.brands.forEach((element: any) => {
            element.selected = false;
          });
        }
        // console.log(this.brands, this.priceRange);
      }
    })
  }

  createPriceRanges(priceMin: number, priceMax: number) {
    const intervals: number = 5;
    const step = (priceMax - priceMin) / intervals;
    const options: any = [];

    let lowerBound = Math.floor(priceMin);

    for (let i = 1; i <= intervals; i++) {
      const upperBound = Math.ceil(priceMin + i * step);
      const label = `₹${lowerBound} - ₹${upperBound}`;
      options.push({ label, selected: false });
      lowerBound = upperBound + 1;
    }

    return options;
  }


  getProductsDetails() {
    let timenow = new Date().getTime();
    let priceFilter = this.selectedPrice.join('|');
    let MfgGroup = this.selectedMfg.join('|');
    let url = `${this.CommonService.searchBaseUrl}product_filter?category_id=${this.filterId}&page=${this.pageNo}&size=${this.pageSize}&panindia=${this.authService.IsPanIndia}&wh=${this.authService.WHId}&pincode=${this.authService.PinCode}&_t=${timenow}&category=&selectedDosage=&MfgGroup=${MfgGroup}&price=${priceFilter}&sortby=${this.selectedSort.sortby}&sortorder=${this.selectedSort.sortorder}`;

    this.CommonService.getSearchData(url).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        let data: any = res.odata;
        this.totalcount = res.record;
        if (data.length > 0) {
          data.forEach((elm: any) => {
            elm.idata[0].addedQty = 0
            this.addedInCart.forEach((item: any) => {
              if (parseInt(elm.idata[0].ProductId) == item.ProductId) {
                elm.idata[0].addedQty = item.ProductCount;
              }
            });

            this.searchList.push(elm.idata[0]);
            this.isLoading = false;
            this.spinner.hide();
          })
          this.categoryViewWebEngage();
          // console.log('searchList', this.searchList);
        } else {
          this.searchList = [];
          this.isLoading = false;
          this.spinner.hide();
        }
      } else {
        this.searchList = [];
        this.isLoading = false;
        this.spinner.hide();
      }
    })
  }


  addToCart(productObj: any, ProductQty: any) {
    // console.log(productObj, ProductQty);
    let productId = productObj.ProductId;
    // let LotId = parseInt(productObj.PKLotId);
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
      ProductCount: parseInt(ProductQty),
      ItemVal: productObj.OfferPrice,
      SSCurrencyValue: ".00",
      Iscourierable: productObj.IsCourierable,
      ProductImage: productObj.ProductImage,
      ProductPrice: productObj.MRP,
      // IsGiftProduct: productObj.IsGiftableProduct,
      PrescriptionOTC: productObj.PrescriptionOTC,
      WarehouseId: this.authService.WHId,
      CPId: 0,
      MyFamilyId: 0,
      PKLotId: parseInt(productObj.PKLotId),
      MfgGroup: productObj.MfgGroup,
      ExpiryDate: productObj.ExpiryDate,
      ProductInteractiveModule: productObj.InteractiveModule,
      ProductInteractiveSubModule: productObj.InteractiveSubModule,
      IsNonReturnable: productObj.IsNonReturnable,
      RefOrderId: 0,
      Brand: productObj.Brand,
      DiscountPercent: productObj.DiscountPercent
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      // let objdata = { 'dts': tmp, 'type': 'update' };
      // this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
    });

    this.addProductWebEngage(tmp, tmp['ProductCount'])

  }

  cartAddPlus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if (item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction'] > qty)) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
        // console.log(updatedItem);
        this.updateById(updatedItem)
      } else {
        // alert('max limit reached');
        alert(`You can order maximum ${item['DosageRestriction']} quantity`);
        // this.headerModal.nativeElement.click();
      }
    });
  }

  cartAddMinus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if (qty > 1) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] - 1 };
        // console.log(updatedItem);
        this.updateById(updatedItem)
      } else {
        // alert('remove');
        this.deleteById(pro_id);
      }
    });
  }

  updateById(tmp: any) {
    this.dbService.update('cartItems', tmp).subscribe((res: any) => {
      // console.log('storeData: ', res);
      if (res) {
        this.getAllRecord();
        // let objdata = { 'dts': tmp, 'type': 'update' };
        // this.CommonService.AClicked(JSON.stringify(objdata))
        this.updateSearchList(tmp)
      }
    });
  }

  updateSearchList(tmp: any) {
    this.searchList = this.searchList.map((obj: any) => {
      if (obj.ProductId == tmp.ProductId) {
        obj.addedQty = tmp.ProductCount;
      } else {
        if (obj.PreferredSubtitute.length > 0) {
          obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
            if (obj1.PreferredProductId == tmp.ProductId) {
              obj1.addedQty = tmp.ProductCount;
            }
            return obj1;
          });
        }
      }
      return obj;
    });
  }

  deleteById(pro_id: any) {
    let id = `${pro_id}_0_0`;
    let item = this.addedInCart.find((prd: any) => prd.ProductId == pro_id);
    this.dbService.deleteByKey('cartItems', id).subscribe((status: any) => {
      // console.log('Deleted?:', status);
      this.removeProductWebEngage(item)
      if (status == true) {
        this.getAllRecord();
        // let objdata = { 'dts': pro_id, 'type': 'del' };
        // this.CommonService.AClicked(JSON.stringify(objdata))
        this.searchList = this.searchList.map((obj: any) => {
          if (obj.ProductId == pro_id) {
            obj.addedQty = 0;
          } else {
            if (obj.PreferredSubtitute.length > 0) {
              obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
                if (obj1.PreferredProductId == pro_id) {
                  obj1.addedQty = 0;
                }
                return obj1;
              });
            }
          }
          return obj;
        });
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent();
      } else {
        // alert('some thing went wrong')
      }
    });
  }

  loadMore() {
    if (this.totalcount > this.searchList.length) {
      this.pageNo = this.pageNo + 1;
      this.getProductsDetails();
    }
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'S');
    // fd.append('DeviceId', '');
    // fd.append('AppType', '');
    // fd.append('AppVersion', '');


    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);      
      if (res && res.response_code == 0) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })

  }


  addProductWebEngage(data: any, Qty: any) {
    let returnable: boolean = false;
    if (data.IsNonReturnable == 0) {
      returnable = true;
    } else {
      returnable = false;
    }
    let dscPrcnt = `${data.DiscountPercent}%`;
    let webData = {
      'Product Name': data.ProductName,
      'Brand': data.MfgGroup ? data.MfgGroup : '',
      'Returnable': returnable,
      'Product Expiry Date': data.ExpiryDate,
      'Delivery Pincode': this.authService.PinCode,
      'Variant Selected': '',
      'Quantity': Qty,
      'Retail Price': data.OfferPrice,
      'Discount Percentage': dscPrcnt,
      'Price': data.ProductPrice,
      'Image': data.ProductImage ? data.ProductImage : '',
    }
    this.webengageService.trackEvent('Product Added To Cart', webData);
  }

  removeProductWebEngage(data: any) {

    let returnable: boolean = false;
    if (data.IsNonReturnable == 0) {
      returnable = true;
    } else {
      returnable = false;
    }
    let dscPrcnt = `${data.DiscountPercent}%`;
    let webData = {
      'Product Name': data.ProductName,
      'Brand': data.MfgGroup,
      'Returnable': returnable,
      'Product Expiry Date': data.ExpiryDate,
      'Delivery Pincode': this.authService.PinCode,
      'Variant Selected': '',
      'Quantity': data.ProductCount,
      'Retail Price': data.OfferPrice,
      'Discount Percentage': dscPrcnt,
      'Price': data.ProductPrice,
      'Image': data.ProductImage,
    }
    this.webengageService.trackEvent('Product Removed From Cart', webData);
  }

  categoryViewWebEngage() {
    if (this.type == 'm') {
      let webData = {
        'Category Name': this.categoryNow[0].CategoryName,
        'Product Count': this.totalcount,
      }
      this.webengageService.trackEvent('Category Viewed', webData);
    } else if (this.type == 's') {
      let webData = {
        'Category Name': this.categoryNow[0].ParentCategoryName,
        'Sub Category Name': this.categoryNow[0].CategoryName,
        'Product Count': this.totalcount,
      }
      this.webengageService.trackEvent('Sub Category Viewed', webData);
    }

  }


  filterByMfg(mfg: any) {
    this.spinner.show();
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.isLoading = true;
    if (mfg.selected == false) {
      this.selectedMfg.push(mfg.key)
      this.brands.forEach((item: any) => {
        if (item.key == mfg.key) {
          item.selected = true;
        }
      });
    } else {
      this.selectedMfg = this.selectedMfg.filter((ds: any) => ds !== mfg.key);
      this.brands.forEach((item: any) => {
        if (item.key == mfg.key) {
          item.selected = false;
        }
      });
    }
    this.searchList = [];
    window.scrollTo(0, 0);
    this.getProductsDetails();

  }


  filterByRange(rng: any) {
    this.spinner.show();
    let cleaned = rng.label.replace(/₹|\s/g, '');
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.isLoading = true;
    if (rng.selected == false) {
      this.selectedPrice.push(cleaned)
      this.priceRange.forEach((item: any) => {
        if (item.label == rng.label) {
          item.selected = true;
        }
      });
    } else {
      this.selectedPrice = this.selectedPrice.filter((ds: any) => ds !== cleaned);
      this.priceRange.forEach((item: any) => {
        if (item.label == rng.label) {
          item.selected = false;
        }
      });
    }
    this.searchList = [];
    window.scrollTo(0, 0);
    this.getProductsDetails();

  }

  resetMfgFilter() {
    this.spinner.show();
    this.selectedMfg = [];
    this.brands.forEach((item: any) => {
      item.selected = false;
    })
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.isLoading = true;
    this.searchList = [];
    window.scrollTo(0, 0);
    this.getProductsDetails();

  }

  resetPriceFilter() {
    this.spinner.show();
    this.selectedPrice = [];
    this.priceRange.forEach((item: any) => {
      item.selected = false;
    });
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.isLoading = true;
    this.searchList = [];
    window.scrollTo(0, 0);
    this.getProductsDetails();
  }

  changeCategory(url: any) {
    const path = url.replace('https://sastasundar.com', '');
    let result = path.split('/').filter(Boolean);
    this.router.navigate(['new/', ...result])
  }

  resetpage() {
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.isLoading = true
    this.categoryNow = {};
    this.filterId = 0;
    this.tabList = [];
    this.filterPanel = [];
    this.brands = [];
    this.priceRange = [];
    this.addedInCart = [];
    this.searchList = [];
    this.selectedMfg = [];
    this.selectedPrice = [];
  }

  updatefromSearch() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
      // console.log(res)
      if (this.addedInCart.length > 0) {
        this.searchList.forEach((item: any) => {
          const match = this.addedInCart.find((elm: any) => parseInt(elm.ProductId) === parseInt(item.ProductId));
          if (match) {
            item.addedQty = match.ProductCount;
          } else {
            item.addedQty = 0;
          }
        });
      } else {
        this.searchList.forEach((elm: any) => {
          elm.addedQty = 0;
        })
      }
    });
  }

  onSortChange(event: any) {
    const selectedIndex = event.target.value;
    this.selectedSort = this.sortOptions[selectedIndex];
    // console.log('Sort By:', this.selectedSort.sortby, selectedIndex);
    // console.log('Sort Order:', this.selectedSort.sortorder);
    // // Call your sort/filter function here
    this.pageNo = 1;
    this.pageSize = 50;
    this.totalcount = 0;
    this.searchList = [];
    // this.isLoading = false;
    this.spinner.show();
    this.getProductsDetails()
  }

  viewProductDetails(encodedId: any, displayname: any, producttype: any) {
    let prod_name = '';
    let pLink = '';

    if (displayname != '' && displayname != null) {
      prod_name = this.CommonService.get_seo_url_string(displayname);
      pLink = prod_name + '-' + encodedId;
      if (prod_name != '' && pLink != '') {
        if (producttype == 'P') {
          this.router.navigate(['neworder-medicine/', pLink]);
        } else {
          this.router.navigate(['neworder-otc/', pLink]);
        }
      }else{
        this.router.navigate([''])
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.categorySub) this.categorySub.unsubscribe();
  }

}
