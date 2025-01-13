// src/app/rendezvous-list/rendezvous-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../../../Services/rendezvous.service'; // Importer le service
import { ActivatedRoute } from '@angular/router'; // Pour récupérer l'ID du patient

@Component({
  selector: 'app-rendezvous-list',
  templateUrl: './rendezvous-list.component.html',
  styleUrls: ['./rendezvous-list.component.css'],
})
export class RendezvousListComponent implements OnInit {
  rendezvousList: any[] = []; // Stocker les rendez-vous
  // patientId: number; // ID du patient

  constructor(
    private rendezvousService: RendezvousService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du patient depuis les paramètres de la route
    this.route.params.subscribe((params) => {
      // this.patientId = +params['id']; // Convertir en nombre
      this.getRendezvousByPatient(1);
    });
  }

  // Récupérer les rendez-vous pour un patient donné
  getRendezvousByPatient(id: number): void {
    this.rendezvousService.getRendezVousByPatient(id).subscribe(
      (response) => {
        this.rendezvousList = response.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    );
  }
}
