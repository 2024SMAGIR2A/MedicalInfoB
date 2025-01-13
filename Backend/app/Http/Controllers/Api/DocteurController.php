<?php

namespace App\Http\Controllers\Api;
use App\Models\Examen;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TypeExamen;

class DocteurController extends Controller
{
    public function addExamination(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'idDossier' => 'required|integer|exists:dossiermedical,idDossier',
            'idTypeExamen' => 'required|integer|exists:typeexamen,idTypeExamen',
            'dateExamen' => 'required|date',
            'resultats' => 'nullable|string',
            'rapport' => 'nullable|string',
            'createdBy' => 'required|integer|exists:utilisateur,idUtilisateur',
            'updatedBy' => 'required|integer|exists:utilisateur,idUtilisateur',
        ]);

        // Si la validation échoue, retourner une erreur
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Créer un nouvel examen
        $examen = Examen::create([
            'idDossier' => $request->idDossier,
            'idTypeExamen' => $request->idTypeExamen,
            'dateExamen' => $request->dateExamen,
            'resultats' => $request->resultats,
            'rapport' => $request->rapport,
            'createdBy' => $request->createdBy,
            'updatedBy' => $request->updatedBy,
            'isDeleted' => false,
        ]);

        // Retourner une réponse JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Examen ajouté avec succès',
            'data' => $examen,
        ], 201);
    }

    public function addExamen(Request $request){
        $validatedData = $request->validate([
            'idDossier' => 'required|integer|exists:dossiermedical,idDossier',
            'idTypeExamen' => 'required|integer|exists:typeexamen,idTypeExamen',
            'dateExamen' => 'required|date',
            'resultats' => 'nullable|string',
            'rapport' => 'nullable|string',
            'createdBy' => 'required|integer|exists:utilisateur,idUtilisateur',
            'updatedBy' => 'required|integer|exists:utilisateur,idUtilisateur',
        ]);

        $examen = Examen::create($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Examen ajouté avec succès',
            'data' => $examen,
        ]);
    }

    /**
     * Lister les examens médicaux
     */
    public function listExaminations()
    {
        // Récupérer tous les examens non supprimés
        $examens = Examen::where('isDeleted', false)
            ->with(['dossierMedical', 'typeExamen', 'createdByUser', 'updatedByUser'])
            ->get();

        // Retourner la réponse JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Liste des examens médicaux',
            'data' => $examens,
        ]);
    }

    public function listExamens(){
        return response()->json([
            'status' => 'success',
            'message' => 'Liste des examens',
            'data' => Examen::all(),
        ]);
    }

    public function listTypeExamens()
    {
        // Récupérer tous les types d'examens non supprimés
        $typeExamens = TypeExamen::where('isDeleted', false)
            ->get(['idTypeExamen', 'nom']);

        return response()->json([
            'status' => 'success',
            'data' => $typeExamens,
        ]);
    }

    public function listPatients()
    {
        // Récupérer tous les types d'examens non supprimés
        $patients = Patient::where('isDeleted', false)
            ->get(['idPatient', 'nomprenoms']);

        return response()->json([
            'status' => 'success',
            'data' => $patients,
        ]);
    }
}
