<?php

namespace App\Http\Controllers;

use App\Models\TypeRendezVous;

class RendezVousController extends Controller
{
    // Méthode pour récupérer la liste des types de rendez-vous
    public function getTypesRendezVous()
    {
        $typesRendezVous = TypeRendezVous::all(); // Récupère tous les types de rendez-vous

        return response()->json([
            'message' => 'Liste des types de rendez-vous',
            'data' => $typesRendezVous,
        ]);
    }
}
