<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeRendezVous extends Model
{
    use HasFactory;

    // Si le nom de la table dans la base de données n'est pas le même que le nom du modèle (par convention, Laravel utilise des noms de table au pluriel en minuscule)
    protected $table = 'TypeRendezVous'; // Assure-toi que le nom de la table est correct

    // Si tu n'utilises pas les timestamps (created_at et updated_at)
    public $timestamps = false; // Supprimer si tu veux utiliser les timestamps
}

