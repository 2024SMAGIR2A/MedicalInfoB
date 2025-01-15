import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnumEndpoints } from 'src/app/Enum/enum-endpoints';
import { EnumStatutDossierMedical } from 'src/app/Enum/enum-statut-dossier-medical';
import { AllergieModel } from 'src/app/Models/allergie-model.model';
import { GenericModel } from 'src/app/Models/generic-model.model';
import { Patient } from 'src/app/Models/patient.model';
import { TraitementModel } from 'src/app/Models/traitement-model.model';
import { RequesterService } from 'src/app/Services/requester.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent {

  constructor(
    private RequesterService : RequesterService,
    private ActivatedRoute : ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.idUtilisateur= parseInt(this.ActivatedRoute.snapshot.params['idUtilisateur']);
    this.GetPatientById()
    this.GetAllPatientDetails()
  }

  idUtilisateur : number=0

  ListPatient : Patient[]=[]
  Patient : any
  GetPatientById()
  {
    this.ListPatient=JSON.parse(localStorage.getItem('PatientList')!)
    this.Patient = this.ListPatient.find(x => x.idUtilisateur == this.idUtilisateur)
  }

  AllergieList : AllergieModel[]=[]
  TraitementList : TraitementModel[]=[]
  EnumStatutDossierMedical = EnumStatutDossierMedical
  async GetAllPatientDetails()
  {
    var Response=await this.RequesterService.AsyncPostResponse(EnumEndpoints.GetAllergieByPatientId,{id : this.idUtilisateur})
    this.AllergieList = Response[1];

    Response=await this.RequesterService.AsyncPostResponse(EnumEndpoints.GetTraitementByPatientId,{id : this.idUtilisateur})
    this.TraitementList = Response[1];

  }



}
