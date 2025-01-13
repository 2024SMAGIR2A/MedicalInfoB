<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Patient extends Model
    {
        use HasFactory;

        protected $table = 'patient'; // Nom de la table dans la base de données
        protected $primaryKey = 'idPatient'; // Clé primaire de la table

        protected $fillable = [
            'nomprenoms',
            'age',
            'isDeleted',
        ];

        // Relation avec les examens médicaux
        /* public function patients()
        {
            return $this->hasMany(DossierMedical::class, 'idDossier');
        } */
    }
