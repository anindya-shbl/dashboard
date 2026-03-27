import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { UploadImagesService } from '../../../services/upload-images.service';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrl: './patient-vitals.component.scss'
})
export class PatientVitalsComponent implements OnInit {

  @Input() bookingDtls: any;

  allergyArr: any = [];
  conditionArr: any = [];

  bookingNo: any = '';
  height: any = '';
  bodyWeight: any = '';
  bodyTemp: any = '';
  bloodPressure: any = '';
  pulse: any = '';
  // pallor: any = '';
  bmi: any = '';
  spO2: any = '';

  alergySelect: boolean = false;
  conditionSelect: boolean = false;
  slectedAllergies: any = [];
  slectedConditions: any = [];

  @Output() ptntVitals = new EventEmitter<any>();

  constructor(private orderService: OrderService, private imagesService: UploadImagesService) { }

  ngOnInit(): void {
    this.getAllergies();
    this.getConditions();
    this.setVitals();
  }

  getAllergies() {
    this.orderService.getDetails(`webapi/consultation/medical_history?qText=a&qType=allergy`).subscribe((res: any) => {
    // let res: any = {
    //   "data": [
    //     {
    //       "SubConditionId": 113,
    //       "SubConditionName": "Abalone"
    //     },
    //     {
    //       "SubConditionId": 114,
    //       "SubConditionName": "Acorn squash"
    //     },
    //     {
    //       "SubConditionId": 115,
    //       "SubConditionName": "Allspice"
    //     },
    //     {
    //       "SubConditionId": 116,
    //       "SubConditionName": "Almond extract"
    //     },
    //     {
    //       "SubConditionId": 117,
    //       "SubConditionName": "Almonds"
    //     },
    //     {
    //       "SubConditionId": 118,
    //       "SubConditionName": "Anchovy"
    //     },
    //     {
    //       "SubConditionId": 119,
    //       "SubConditionName": "Artichoke"
    //     },
    //     {
    //       "SubConditionId": 120,
    //       "SubConditionName": "Asparagus"
    //     },
    //     {
    //       "SubConditionId": 121,
    //       "SubConditionName": "Avocado"
    //     },
    //     {
    //       "SubConditionId": 163,
    //       "SubConditionName": "Food additives"
    //     },
    //     {
    //       "SubConditionId": 175,
    //       "SubConditionName": "Insect stings (bees, wasps, ants)"
    //     },
    //     {
    //       "SubConditionId": 190,
    //       "SubConditionName": "Medications (penicillin, aspirin, etc.)"
    //     },
    //     {
    //       "SubConditionId": 195,
    //       "SubConditionName": "Nut oils (almond oil, walnut oil)"
    //     },
    //     {
    //       "SubConditionId": 208,
    //       "SubConditionName": "Pet hair (cats and dogs)"
    //     },
    //     {
    //       "SubConditionId": 626,
    //       "SubConditionName": "com all"
    //     },
    //     {
    //       "SubConditionId": 256,
    //       "SubConditionName": "ACE inhibitors (Angiotensin-Converting Enzyme Inhibitors)"
    //     },
    //     {
    //       "SubConditionId": 257,
    //       "SubConditionName": "ACE inhibitors (Enalapril, Lisinopril)"
    //     },
    //     {
    //       "SubConditionId": 258,
    //       "SubConditionName": "Acetaminophen"
    //     },
    //     {
    //       "SubConditionId": 259,
    //       "SubConditionName": "Amoxicillin"
    //     },
    //     {
    //       "SubConditionId": 260,
    //       "SubConditionName": "Anticoagulant medications (e.g., Dabigatran)"
    //     },
    //     {
    //       "SubConditionId": 261,
    //       "SubConditionName": "Anticoagulants (e.g., Rivaroxaban)"
    //     },
    //     {
    //       "SubConditionId": 262,
    //       "SubConditionName": "Antidepressant medications (e.g., Amitriptyline)"
    //     },
    //     {
    //       "SubConditionId": 263,
    //       "SubConditionName": "Antidiabetic medications (e.g., Metformin)"
    //     },
    //     {
    //       "SubConditionId": 264,
    //       "SubConditionName": "Antiepileptic medications (e.g., Carbamazepine)"
    //     },
    //     {
    //       "SubConditionId": 265,
    //       "SubConditionName": "Antifungal medications (e.g., Fluconazole)"
    //     },
    //     {
    //       "SubConditionId": 266,
    //       "SubConditionName": "Antihistamines (e.g., Diphenhydramine)"
    //     },
    //     {
    //       "SubConditionId": 267,
    //       "SubConditionName": "Antimalarial medications (e.g., Chloroquine)"
    //     },
    //     {
    //       "SubConditionId": 268,
    //       "SubConditionName": "Antiplatelet medications (e.g., Clopidogrel)"
    //     },
    //     {
    //       "SubConditionId": 269,
    //       "SubConditionName": "Antipsychotic medications (e.g., Haloperidol)"
    //     },
    //     {
    //       "SubConditionId": 270,
    //       "SubConditionName": "Antipsychotic medications (e.g., Risperidone)"
    //     },
    //     {
    //       "SubConditionId": 271,
    //       "SubConditionName": "Antiretroviral medications (e.g., Lamivudine)"
    //     },
    //     {
    //       "SubConditionId": 272,
    //       "SubConditionName": "Antithyroid medications (e.g., Methimazole)"
    //     },
    //     {
    //       "SubConditionId": 273,
    //       "SubConditionName": "Antiviral medications (e.g., Acyclovir)"
    //     },
    //     {
    //       "SubConditionId": 274,
    //       "SubConditionName": "Aspirin"
    //     },
    //     {
    //       "SubConditionId": 275,
    //       "SubConditionName": "Atropine"
    //     },
    //     {
    //       "SubConditionId": 278,
    //       "SubConditionName": "Beta-blockers (e.g., Atenolol)"
    //     },
    //     {
    //       "SubConditionId": 287,
    //       "SubConditionName": "Enzyme replacement therapies (e.g., Alglucosidase alfa)"
    //     },
    //     {
    //       "SubConditionId": 302,
    //       "SubConditionName": "NSAIDs (Nonsteroidal Anti-Inflammatory Drugs)"
    //     },
    //     {
    //       "SubConditionId": 307,
    //       "SubConditionName": "Statins (e.g., Atorvastatin)"
    //     },
    //     {
    //       "SubConditionId": 623,
    //       "SubConditionName": "Custom Medial Allergy"
    //     },
    //     {
    //       "SubConditionId": 656,
    //       "SubConditionName": "ace"
    //     },
    //     {
    //       "SubConditionId": 657,
    //       "SubConditionName": "ace"
    //     }
    //   ],
    //   "status": 200,
    //   "message": "Medical history fetched successfully"
    // }
    if (res && res['status'] == 200) {
      let data = res['data'];
      if (data.length > 0) {
        data.forEach((ds: any) => {
          ds.checked = false;
        })
      }
      this.allergyArr = data;
      this.setslectedAllergies();
    } else {
      this.allergyArr = [];
    }
    })
  }

  getConditions() {
    this.orderService.getDetails(`webapi/consultation/medical_history?qText=a&qType=condition`).subscribe((res: any) => {
    // let res: any = {
    //   "data": [
    //     {
    //       "SubConditionId": 113,
    //       "SubConditionName": "Abalone"
    //     },
    //     {
    //       "SubConditionId": 114,
    //       "SubConditionName": "Acorn squash"
    //     },
    //     {
    //       "SubConditionId": 115,
    //       "SubConditionName": "Allspice"
    //     },
    //     {
    //       "SubConditionId": 116,
    //       "SubConditionName": "Almond extract"
    //     },
    //     {
    //       "SubConditionId": 117,
    //       "SubConditionName": "Almonds"
    //     },
    //     {
    //       "SubConditionId": 118,
    //       "SubConditionName": "Anchovy"
    //     },
    //     {
    //       "SubConditionId": 119,
    //       "SubConditionName": "Artichoke"
    //     },
    //     {
    //       "SubConditionId": 120,
    //       "SubConditionName": "Asparagus"
    //     },
    //     {
    //       "SubConditionId": 121,
    //       "SubConditionName": "Avocado"
    //     },
    //     {
    //       "SubConditionId": 163,
    //       "SubConditionName": "Food additives"
    //     },
    //     {
    //       "SubConditionId": 175,
    //       "SubConditionName": "Insect stings (bees, wasps, ants)"
    //     },
    //     {
    //       "SubConditionId": 190,
    //       "SubConditionName": "Medications (penicillin, aspirin, etc.)"
    //     },
    //     {
    //       "SubConditionId": 195,
    //       "SubConditionName": "Nut oils (almond oil, walnut oil)"
    //     },
    //     {
    //       "SubConditionId": 208,
    //       "SubConditionName": "Pet hair (cats and dogs)"
    //     },
    //     {
    //       "SubConditionId": 626,
    //       "SubConditionName": "com all"
    //     },
    //     {
    //       "SubConditionId": 256,
    //       "SubConditionName": "ACE inhibitors (Angiotensin-Converting Enzyme Inhibitors)"
    //     },
    //     {
    //       "SubConditionId": 257,
    //       "SubConditionName": "ACE inhibitors (Enalapril, Lisinopril)"
    //     },
    //     {
    //       "SubConditionId": 258,
    //       "SubConditionName": "Acetaminophen"
    //     },
    //     {
    //       "SubConditionId": 259,
    //       "SubConditionName": "Amoxicillin"
    //     },
    //     {
    //       "SubConditionId": 260,
    //       "SubConditionName": "Anticoagulant medications (e.g., Dabigatran)"
    //     },
    //     {
    //       "SubConditionId": 261,
    //       "SubConditionName": "Anticoagulants (e.g., Rivaroxaban)"
    //     },
    //     {
    //       "SubConditionId": 262,
    //       "SubConditionName": "Antidepressant medications (e.g., Amitriptyline)"
    //     },
    //     {
    //       "SubConditionId": 263,
    //       "SubConditionName": "Antidiabetic medications (e.g., Metformin)"
    //     },
    //     {
    //       "SubConditionId": 264,
    //       "SubConditionName": "Antiepileptic medications (e.g., Carbamazepine)"
    //     },
    //     {
    //       "SubConditionId": 265,
    //       "SubConditionName": "Antifungal medications (e.g., Fluconazole)"
    //     },
    //     {
    //       "SubConditionId": 266,
    //       "SubConditionName": "Antihistamines (e.g., Diphenhydramine)"
    //     },
    //     {
    //       "SubConditionId": 267,
    //       "SubConditionName": "Antimalarial medications (e.g., Chloroquine)"
    //     },
    //     {
    //       "SubConditionId": 268,
    //       "SubConditionName": "Antiplatelet medications (e.g., Clopidogrel)"
    //     },
    //     {
    //       "SubConditionId": 269,
    //       "SubConditionName": "Antipsychotic medications (e.g., Haloperidol)"
    //     },
    //     {
    //       "SubConditionId": 270,
    //       "SubConditionName": "Antipsychotic medications (e.g., Risperidone)"
    //     },
    //     {
    //       "SubConditionId": 271,
    //       "SubConditionName": "Antiretroviral medications (e.g., Lamivudine)"
    //     },
    //     {
    //       "SubConditionId": 272,
    //       "SubConditionName": "Antithyroid medications (e.g., Methimazole)"
    //     },
    //     {
    //       "SubConditionId": 273,
    //       "SubConditionName": "Antiviral medications (e.g., Acyclovir)"
    //     },
    //     {
    //       "SubConditionId": 274,
    //       "SubConditionName": "Aspirin"
    //     },
    //     {
    //       "SubConditionId": 275,
    //       "SubConditionName": "Atropine"
    //     },
    //     {
    //       "SubConditionId": 278,
    //       "SubConditionName": "Beta-blockers (e.g., Atenolol)"
    //     },
    //     {
    //       "SubConditionId": 287,
    //       "SubConditionName": "Enzyme replacement therapies (e.g., Alglucosidase alfa)"
    //     },
    //     {
    //       "SubConditionId": 302,
    //       "SubConditionName": "NSAIDs (Nonsteroidal Anti-Inflammatory Drugs)"
    //     },
    //     {
    //       "SubConditionId": 307,
    //       "SubConditionName": "Statins (e.g., Atorvastatin)"
    //     },
    //     {
    //       "SubConditionId": 623,
    //       "SubConditionName": "Custom Medial Allergy"
    //     },
    //     {
    //       "SubConditionId": 656,
    //       "SubConditionName": "ace"
    //     },
    //     {
    //       "SubConditionId": 657,
    //       "SubConditionName": "ace"
    //     }
    //   ],
    //   "status": 200,
    //   "message": "Medical history fetched successfully"
    // }
    if (res && res['status'] == 200) {
      let data = res['data'];
      if (data.length > 0) {
        data.forEach((ds: any) => {
          ds.checked = false;
        })
      }
      this.conditionArr = data;
      this.setslectedConditions();
    } else {
      this.conditionArr = [];
    }
    })
  }

  setVitals() {
    this.bookingNo = this.bookingDtls.BookingNo;
    this.height = this.bookingDtls.PatientVitalsInfo.Height;
    this.bodyWeight = this.bookingDtls.PatientVitalsInfo.BodyWeight;
    this.bodyTemp = this.bookingDtls.PatientVitalsInfo.BodyTemp;
    this.bloodPressure = this.bookingDtls.PatientVitalsInfo.BloodPressure;
    this.pulse = this.bookingDtls.PatientVitalsInfo.Pulse;
    this.bmi = this.bookingDtls.PatientVitalsInfo.BMI;
    this.spO2 = this.bookingDtls.PatientVitalsInfo.SpO2;
    // this.reportDocuments = this.bookingDtls.PatientVitalsInfo.ReportDocuments;
    // this.prscDocs = this.bookingDtls.PatientVitalsInfo.PrescriptionDocuments
    // this.setslectedAllergies();
    // this.setslectedConditions();
  }

  setslectedAllergies() {
    let algd: any = [];
    if (this.bookingDtls.PatientVitalsInfo.CommonAllergiesData.length > 0) {
      this.bookingDtls.PatientVitalsInfo.CommonAllergiesData.forEach((d: any) => {
        algd.push({ id: d.ConditionId, name: d.ConditionName })
        this.updateAllergyList(d)
      })
      this.slectedAllergies = algd;
    } else {
      this.slectedAllergies = [];
    }
  }

  setslectedConditions() {
    let algd: any = [];
    if (this.bookingDtls.PatientVitalsInfo.ChronicConditionData > 0) {
      this.bookingDtls.PatientVitalsInfo.ChronicConditionData.forEach((d: any) => {
        algd.push({ id: d.ConditionId, name: d.ConditionName })
        this.updateConditionList(d)
      })
      this.slectedConditions = algd;
    } else {
      this.slectedConditions = [];
    }
  }

  updateAllergyList(d: any) {
    this.allergyArr = this.allergyArr.map((obj: any) => {
      if (obj.SubConditionId == d.ConditionId) {
        obj.checked = true;
      }
      return obj
    })
  }

  updateConditionList(d: any) {
    this.conditionArr = this.conditionArr.map((obj: any) => {
      if (obj.SubConditionId == d.ConditionId) {
        obj.checked = true;
      }
      return obj
    })
  }

  setAllergies(value: any) {
    if (value.checked == false) {
      this.slectedAllergies.push({ id: value.SubConditionId, name: value.SubConditionName });
      this.allergyArr = this.allergyArr.map((obj: any) => {
        if (obj.SubConditionId == value.SubConditionId) {
          obj.checked = true;
        }
        return obj
      })
    } else {
      this.slectedAllergies = this.slectedAllergies.filter((item: any) => item.id !== value.SubConditionId);
      this.allergyArr = this.allergyArr.map((obj: any) => {
        if (obj.SubConditionId == value.SubConditionId) {
          obj.checked = false;
        }
        return obj
      })
    }
    console.log(this.slectedAllergies)
  }

  setConditions(value: any) {
    if (value.checked == false) {
      this.slectedConditions.push({ id: value.SubConditionId, name: value.SubConditionName });
      this.conditionArr = this.conditionArr.map((obj: any) => {
        if (obj.SubConditionId == value.SubConditionId) {
          obj.checked = true;
        }
        return obj
      })
    } else {
      this.slectedConditions = this.slectedConditions.filter((item: any) => item.id !== value.SubConditionId);
      this.conditionArr = this.conditionArr.map((obj: any) => {
        if (obj.SubConditionId == value.SubConditionId) {
          obj.checked = false;
        }
        return obj
      })
    }
    console.log(this.slectedConditions)
  }


  onSubmit() {
    let allergyIds: any = [];
    let conditionIds: any = [];
    if(this.slectedAllergies.length>0){
      this.slectedAllergies.forEach((d: any)=>{
        allergyIds.push(d.id)
      })
    };

    if(this.slectedConditions.length>0){
      this.slectedConditions.forEach((d: any)=>{
        conditionIds.push(d.id)
      })
    };

    let data = {
      'bookingNo': this.bookingNo,
      'height': this.height,
      'bodyWeight': this.bodyWeight,
      'bodyTemp': this.bodyTemp,
      'bloodPressure': this.bloodPressure,
      'pulse': this.pulse,
      'bmi': this.bmi,
      'spO2': this.spO2,
      'ChronicConditionsId': JSON.stringify(conditionIds),
      'CommonAllergiesId': JSON.stringify(allergyIds)
      // 'reportDocuments': this.reportDocuments,
    }
    this.ptntVitals.emit({ dtls: data, type: 'edit' });
  }

  // onReset() { }

}
