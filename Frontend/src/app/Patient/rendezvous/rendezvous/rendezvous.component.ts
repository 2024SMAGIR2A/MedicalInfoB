import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RendezvousService } from '../../../Services/rendezvous.service';

@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
})
export class RendezvousComponent {
  rendezvousForm: FormGroup;
  successMessage: string = '';
  rendezVous: any[] = [];
  patientId: number = 0;
  constructor(
    private fb: FormBuilder,
    private rendezvousService: RendezvousService
  ) {
    this.rendezvousForm = this.fb.group({
      idPatient: ['1', Validators.required],
      idMedecin: ['', Validators.required],
      idTypeRendezVous: ['', Validators.required],
      dateHeure: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.initForm();
    this.getTypesRendezVous();
    this.getMedecin()
  }
  typesRendezVous:any= [];
  Medecins:any= [];
  
  onSubmit() {
    if (this.rendezvousForm.valid) {
      this.rendezvousService.prendreRendezVous(this.rendezvousForm.value).subscribe(
        (response: { message: string; }) => {
          console.log(this.rendezvousForm.value);
          this.successMessage = response.message;
          this.rendezvousForm.reset();
        },
        (error: any) => {
          console.error('Erreur lors de la prise de rendez-vous :', error);
        }
      );
    }
  }

  getTypesRendezVous(): void {
    this.rendezvousService.getTypesRendezVous().subscribe(
      (responses) => {
        this.typesRendezVous = responses.data;
        console.log(this.typesRendezVous)
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de rendez-vous', error);
      }
    );
  }

  getMedecin(): void {
    this.rendezvousService.getMedecin().subscribe(
      (responses) => {
        this.Medecins = responses.data;
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de rendez-vous', error);
      }
    );
  }

  getRendezVousByPatient(): void {
    if (this.patientId > 0) {
      this.rendezvousService.getRendezVousByPatient(this.patientId).subscribe(
        (response: any) => {
          this.rendezVous = response.data; // Stocke les rendez-vous récupérés
        },
        (error) => {
          console.error('Erreur lors de la récupération des rendez-vous du patient', error);
        }
      );
    } else {
      console.warn('Veuillez entrer un ID de patient valide.');
    }
  }

  
  
}
