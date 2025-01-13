<?php

namespace App\Http\Services\Api;

use App\Http\Constants\GlobalConst;
use App\Http\Helpers\ApiResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UtilisateurService {

    private $userTable;

    function __construct()
    {
        $this->userTable = 'Utilisateur';
    }


    public function getTimeSlot($filters = [])
    {
        try {
            $query = DB::table('CreneauxDisponibles as cd')
                ->select([
                    'cd.idCreneau',
                    'cd.idUtilisateur',
                    'cd.dateDebut',
                    'cd.dateFin',
                    'u.nom as nomMedecin',
                    'u.prenom as prenomMedecin',
                    's.nom'
                ])
                ->join('Utilisateur as u', 'cd.idUtilisateur', '=', 'u.idUtilisateur')
                ->join('Specialite as s', 'u.idSpecialite', '=', 's.idSpecialite')
                ->where('cd.dateDebut', '>', now());

            // Apply filters if provided
            if (!empty($filters['specialite'])) {
                $query->where('s.idSpecialite', $filters['specialite']);
            }

            if (!empty($filters['medecin'])) {
                $query->where('u.idUtilisateur', $filters['medecin']);
            }

            if (!empty($filters['date'])) {
                $date = date('Y-m-d', strtotime($filters['date']));
                $query->whereDate('cd.dateDebut', $date);
            }

            $timeSlots = $query->orderBy('cd.dateDebut', 'asc')->get();

            if ($timeSlots->isEmpty()) {
                return ApiResponse::return_success_response(
                    ApiResponse::NO_CONTENT,
                    [],
                    204
                );
            }

            // Format the response data
            $formattedSlots = $timeSlots->map(function ($slot) {
                return [
                    'id' => $slot->idCreneau,
                    'medecin' => [
                        'id' => $slot->idUtilisateur,
                        'nom' => $slot->nomMedecin,
                        'prenom' => $slot->prenomMedecin,
                        'specialite' => $slot->nom
                    ],
                    'debut' => $slot->dateDebut,
                    'fin' => $slot->dateFin
                ];
            });


            return ApiResponse::return_success_response(
                ApiResponse::OK,
                $formattedSlots,
                200
            );

        } catch (\Exception $e) {
            Log::error('Error getTimeSlot: ' . $e->getMessage());
            return ApiResponse::return_server_error_response();
        }
    }

    public function chooseTimeSlot($data) {
        try {
            // Validate input
            if (!isset($data['timeSlotId']) || !isset($data['patientId'])) {
                return ApiResponse::return_error_response(
                    ApiResponse::BAD_REQUEST,
                    'Données manquantes pour le rendez-vous',
                    400
                );
            }

            // Use transaction to ensure data consistency
            return DB::transaction(function () use ($data) {
                // Update time slot status
                $timeSlot = DB::table('CreneauxDisponibles')
                    ->where('idCreneau', $data['timeSlotId'])
                    ->first();

                if (!$timeSlot) {
                    return ApiResponse::return_error_response(
                        ApiResponse::BAD_REQUEST,
                        'Ce créneau n\'est plus disponible',
                        400
                    );
                }

                // Create appointment
                DB::table('RendezVous')->insert([
                    'idPatient' => $data['patientId'],
                    'idMedecin' => $timeSlot->idUtilisateur,
                    'idStatutRendezVous' => 1,
                    'dateHeure' => $timeSlot->dateDebut,
                    'createdAt' => now(),
                    'updatedAt' => now(),
                    'idTypeRendezVous' => GlobalConst::CONSULTATION,

                ]);

                return ApiResponse::return_success_response(
                    ApiResponse::OK,
                    'Rendez-vous choisi avec succès',
                    200
                );
            });

        } catch (\Exception $e) {
            Log::error('Error chooseTimeSlot: ' . $e->getMessage());
            return ApiResponse::return_server_error_response();
        }
    }

}
