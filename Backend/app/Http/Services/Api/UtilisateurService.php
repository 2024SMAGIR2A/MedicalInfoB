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
