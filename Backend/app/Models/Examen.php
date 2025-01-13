<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    use HasFactory;

    protected $table = 'examen';
    protected $primaryKey = 'idExamen';

    const CREATED_AT = 'createdAt'; // Nom de la colonne personnalisée pour created_at
    const UPDATED_AT = 'updatedAt'; // Nom de la colonne personnalisée pour updated_at

    protected $fillable = [
        'idDossier',
        'idTypeExamen',
        'dateExamen',
        'resultats',
        'rapport',
        'createdBy',
        'updatedBy',
        'isDeleted',
    ];

    public function dossierMedical()
    {
        return $this->belongsTo(DossierMedical::class, 'idDossier');
    }

    public function typeExamen()
    {
        return $this->belongsTo(TypeExamen::class, 'idTypeExamen');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'createdBy');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updatedBy');
    }
}
