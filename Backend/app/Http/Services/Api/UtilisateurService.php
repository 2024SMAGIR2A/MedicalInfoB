<?php

namespace App\Http\Services\Api;

use App\Http\Helpers\ApiResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UtilisateurService {

    private $userTable;

    function __construct()
    {
        $this->userTable = 'Utilisateur';
    }

    public function chooseTimeSlot($data){

        try {
            //code...

            $appointment = DB::table('CreneauxDisponibles')
                                ->where('id', $data['idCreneau'])
                                ->update(['status' => 'choisi']);

            $dataRdv = [
                'idPatient' => $data['idPatient'],
                'idCreneau' => $data['idCreneau'],
                'idStatutRendezVous' => 'choisi'
            ];

            $appointment = DB::table('RendezVous')
                                ->insert([
                                    'idPatient' => $data['idPatient'],
                                    'idCreneau' => $data['idCreneau'],
                                    'idStatutRendezVous' => 'choisi'
                                ]);


            return ApiResponse::return_success_response(ApiResponse::OK, 'Rendez-vous choisi avec succès', 200);

        } catch (\Throwable $th) {
            //throw $th;

            Log::error('Error chooseTimeSlot: ' . $th->getMessage());
            return ApiResponse::return_error_response(ApiResponse::SERVER_ERROR, 'Erreur lors du choix du rendez-vous', 500);
        }

    }

}
