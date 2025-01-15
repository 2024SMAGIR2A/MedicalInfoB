import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamenService } from '../../Services/examen.service';
import { PATIENTS } from '../../data/patients'; // Importer les patients
import { TYPE_EXAMENS } from '../../data/type-examens'; // Importer les types d'examens

@Component({
  selector: 'app-add-examen',
  templateUrl: './add-examen.component.html',
  styleUrls: ['./add-examen.component.css'],
})
export class AddExamenComponent implements OnInit {
  examenForm: FormGroup; // Formulaire réactif

  // Utiliser les données statiques importées
  patients = PATIENTS;
  typeExamens = TYPE_EXAMENS;

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService
  ) {
    // Initialiser le formulaire réactif
    this.examenForm = this.fb.group({
      idDossier: ['', Validators.required],
      idTypeExamen: ['', Validators.required],
      dateExamen: ['', Validators.required],
      resultats: [''],
      rapport: [''],
    });
  }

  ngOnInit(): void {
    // Aucun appel API nécessaire car les données sont statiques
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.examenForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Récupérer les données du formulaire
    const examenData = this.examenForm.value;

    // Ajouter les champs manquants (createdBy, updatedBy, etc.)
    examenData.createdBy = 1; // Remplacez par l'ID de l'utilisateur connecté
    examenData.updatedBy = 1; // Remplacez par l'ID de l'utilisateur connecté
    examenData.isDeleted = false;

    // Envoyer les données à l'API
    this.examenService.addExamen(examenData).subscribe(
      (response) => {
        console.log('Examen ajouté avec succès :', response);
        alert('Examen ajouté avec succès !');
        this.examenForm.reset(); // Réinitialiser le formulaire
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'examen :', error);
        alert('Une erreur s\'est produite. Veuillez réessayer.');
      }
    );
  }
}
