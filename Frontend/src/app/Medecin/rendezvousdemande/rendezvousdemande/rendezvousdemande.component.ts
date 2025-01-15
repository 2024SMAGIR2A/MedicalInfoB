import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RendezvousService } from 'src/app/Services/rendezvous.service';

@Component({
  selector: 'app-rendezvousdemande',
  templateUrl: './rendezvousdemande.component.html',
  styleUrls: ['./rendezvousdemande.component.css']
})
export class RendezvousdemandeComponent {
  constructor(
    private rendezvousService: RendezvousService,
    private route: ActivatedRoute
  ) {}

  demandes: any[] = []; // Liste des demandes
  medecinId: any = 1;
  ngOnInit(): void {
    // Récupérer l'ID du médecin
    this.route.params.subscribe((params) => {
      this.medecinId = +params['id'];
      this.loadDemandes();
    });
  }

  // Charger les demandes du médecin
  loadDemandes(): void {
    this.rendezvousService.getDemandesMedecin(this.medecinId).subscribe(
      (response) => {
        this.demandes = response.data;
        console.log(this.demandes)
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes', error);
      }
    );
  }

  // Valider un rendez-vous
  validerRendezVous(id: number): void {
    this.rendezvousService.validerRendezVous(id).subscribe(
      () => {
        alert('Rendez-vous validé avec succès');
        this.loadDemandes(); // Recharger les demandes
      },
      (error) => {
        console.error('Erreur lors de la validation', error);
      }
    );
  }

  // Refuser un rendez-vous
  refuserRendezVous(id: number): void {
    this.rendezvousService.refuserRendezVous(id).subscribe(
      () => {
        alert('Rendez-vous refusé avec succès');
        this.loadDemandes(); // Recharger les demandes
      },
      (error) => {
        console.error('Erreur lors du refus', error);
      }
    );
  }
}
