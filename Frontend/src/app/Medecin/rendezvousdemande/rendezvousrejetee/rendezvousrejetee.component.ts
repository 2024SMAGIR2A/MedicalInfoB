import { Component } from '@angular/core';
import { RendezvousService } from 'src/app/Services/rendezvous.service';

@Component({
  selector: 'app-rendezvousrejetee',
  templateUrl: './rendezvousrejetee.component.html',
  styleUrls: ['./rendezvousrejetee.component.css']
})
export class RendezvousrejeteeComponent {
  demandesAcceptees: any[] = [];
  demandesRejetees: any[] = [];
  loading: boolean = true;
  demandes: any[] = [];
  medecinId: any = 1;
  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    // this.getDemandesAcceptees();
    this.getDemandesRejetees();
    this.loadDemandes();
  }

  // getDemandesAcceptees(): void {
  //   this.rendezvousService.getDemandesAcceptees().subscribe(
  //     (response) => {
  //       this.demandesAcceptees = response.data;
  //       this.loading = false;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des demandes acceptées', error);
  //     }
  //   );
  // }

  getDemandesRejetees(): void {
    this.rendezvousService.getDemandesRejetees().subscribe(
      (response) => {
        this.demandesRejetees = response.data;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes rejetées', error);
      }
    );
  }

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
}
