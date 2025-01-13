<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\TypeRendezVous;
use App\Models\Medecin;
class RendezVousController extends Controller
{
    public function store(Request $request)
    {
        // Valider les données envoyées
        $validated = $request->validate([
            'idPatient' => 'required|exists:Utilisateur,idUtilisateur',
            'idMedecin' => 'required|exists:Utilisateur,idUtilisateur',
            'idTypeRendezVous' => 'required|exists:TypeRendezVous,idTypeRendezVous',
            'dateHeure' => 'required|date|after:now',
        ]);

        // Créer le rendez-vous
        $rendezVous = RendezVous::create([
            'idPatient' => $validated['idPatient'],
            'idMedecin' => $validated['idMedecin'],
            'idTypeRendezVous' => $validated['idTypeRendezVous'],
            'idStatutRendezVous' => 1, // Par défaut : "Planifié"
            'dateHeure' => $validated['dateHeure'],
        ]);

        return response()->json([
            'message' => 'Rendez-vous pris avec succès',
            'data' => $rendezVous,
        ], 201);
    }

    public function getTypesRendezVous()
{
    // Récupère uniquement les colonnes id et nom du type de rendez-vous
    $typesRendezVous = TypeRendezVous::select('idTypeRendezVous', 'nom')->get();

    return response()->json([
        'message' => 'Liste des types de rendez-vous',
        'data' => $typesRendezVous,
    ]);


}

public function getMedecins()
    {
        $medecins = Medecin::where('idRole', 1)->get(['idUtilisateur','nom','prenom']);

        return response()->json([
            'message' => 'Liste des médecins',
            'data' => $medecins,
        ]);
    }

    public function getRendezVousByPatient($idPatient)
{
    // Vérifie si le patient existe dans la table 'Medecin' via 'idUtilisateur'
    $patient = Medecin::where('idUtilisateur', $idPatient)->first();  // Remplacer find() par where() pour idUtilisateur
    if (!$patient) {
        return response()->json([
            'message' => 'Patient non trouvé',
        ], 404);
    }

    // Récupère les rendez-vous associés au patient
    $rendezVous = RendezVous::with(['medecin', 'typeRendezVous'])
        ->where('idPatient', $idPatient)
        ->get();

    return response()->json([
        'message' => 'Liste des rendez-vous pour le patient',
        'data' => $rendezVous,
    ]);
}

public function getDemandesMedecin($idMedecin)
{
    // Récupérer les rendez-vous du médecin non validés
    $demandes = RendezVous::with(['patient', 'typeRendezVous'])
        ->where('idMedecin', $idMedecin)
        ->where('idStatutRendezVous', 1) // Statut 1 : "Planifié" ou en attente
        ->orderBy('dateHeure', 'asc')
        ->get();

    return response()->json([
        'message' => 'Liste des demandes de rendez-vous',
        'data' => $demandes,
    ]);
}

public function validerRendezVous($id)
{
    $rendezVous = RendezVous::where('idRendezVous',$id)->first();

    if (!$rendezVous) {
        return response()->json(['message' => 'Rendez-vous introuvable'], 404);
    }

    $rendezVous->idStatutRendezVous = 2; // Statut 2 : "Validé"
    $rendezVous->save();

    return response()->json(['message' => 'Rendez-vous validé avec succès']);
}

public function refuserRendezVous($id)
{
    $rendezVous = RendezVous::where('idRendezVous',$id)->first();

    if (!$rendezVous) {
        return response()->json(['message' => 'Rendez-vous introuvable'], 404);
    }

    $rendezVous->idStatutRendezVous = 3; // Statut 3 : "Refusé"
    $rendezVous->save();

    return response()->json(['message' => 'Rendez-vous refusé avec succès']);
}

public function getDemandesAcceptees()
{
    $rendezVous = RendezVous::with(['medecin', 'typeRendezVous', 'patient'])
        ->where('idStatutRendezVous', 2) // Statut 2 : Accepté
        ->get();

    return response()->json([
        'message' => 'Liste des demandes acceptées',
        'data' => $rendezVous,
    ]);
}

public function getDemandesRejetees()
{
    $rendezVous = RendezVous::with(['medecin', 'typeRendezVous', 'patient'])
        ->where('idStatutRendezVous', 3) // Statut 3 : Rejeté
        ->get();

    return response()->json([
        'message' => 'Liste des demandes rejetées',
        'data' => $rendezVous,
    ]);
}

}
