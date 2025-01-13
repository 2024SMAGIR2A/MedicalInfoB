<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'RendezVous';
    protected $primaryKey = 'idRendezVous';
    protected $fillable = [
        'idPatient',
        'idMedecin',
        'idTypeRendezVous',
        'idStatutRendezVous',
        'dateHeure',
    ];

    // Relation avec la table Utilisateur pour le patient
    public function patient()
    {
        return $this->belongsTo(Medecin::class, 'idPatient', 'idUtilisateur');
    }

    // Relation avec la table Utilisateur pour le médecin
    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'idMedecin', 'idUtilisateur');
    }

    // Relation avec la table TypeRendezVous
    public function typeRendezVous()
    {
        return $this->belongsTo(TypeRendezVous::class, 'idTypeRendezVous', 'idTypeRendezVous');
    }

    // Relation avec la table StatutRendezVous
    public function statutRendezVous()
    {
        return $this->belongsTo(StatutRendezVous::class, 'idStatutRendezVous', 'idStatutRendezVous');
    }
}

