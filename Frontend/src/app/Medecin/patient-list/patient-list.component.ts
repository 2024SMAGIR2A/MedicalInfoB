import { Component } from '@angular/core';
import { EnumEndpoints } from 'src/app/Enum/enum-endpoints';
import { Patient } from 'src/app/Models/patient.model';
import { RequesterService } from 'src/app/Services/requester.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {

  constructor(
    private RequesterService : RequesterService
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.GetPatientList()
  }


  PatientList : Patient[]=[]
  async GetPatientList()
  {

    var Response= await this.RequesterService.AsyncPostResponse(EnumEndpoints.GetPatientList,{})
    this.PatientList=Response[1]

    localStorage.removeItem('PatientList')
    localStorage.setItem('PatientList', JSON.stringify(this.PatientList))
  }

}
