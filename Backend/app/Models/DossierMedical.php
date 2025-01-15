<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class DossierMedical extends Model
    {
        use HasFactory;

        protected $table = 'dossiermedical'; // Nom de la table dans la base de données
        protected $primaryKey = 'idDossier'; // Clé primaire de la table

        protected $fillable = [
            'idPatient',
            'idMedecin',
            'idStatutDossierMedical',
            'dateCreation',
            'createdBy',
            'updatedBy',
            'isDeleted',
            // Ajoutez ici d'autres champs de la table
        ];

        // Relation avec les examens médicaux
        public function examens()
        {
            return $this->hasMany(Examen::class, 'idDossier');
        }

        public function patient()
        {
            return $this->belongsTo(patient::class, 'id');
        }
    }
