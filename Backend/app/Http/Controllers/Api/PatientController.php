<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Services\Api\UtilisateurService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
Use Exception;
use App\Models\DossierMedical;


class PatientController extends Controller
{
    //
    private $patientService;

    public function __construct(UtilisateurService $patientService)
    {
        $this->patientService = $patientService;
    }

    public function chooseTimeSlot(Request $request){
        $validator = Validator::make($request->all(), [
            'timeSlotId' => 'required|integer',
            'patientId' => 'required|integer',
        ]);

        if ($validator->fails()) {

            $errorDetail = $validator->errors()->messages();

            return ApiResponse::return_error_response(ApiResponse::BAD_REQUEST, $errorDetail, 400);
        }

        $validatedData = $validator->validated();

        return $this->patientService->chooseTimeSlot($validatedData);
    }



    public function askForAppointment(Request $request){

    }

    public function GetPatientList()
    {
        try
        {
            $data=DB::select(
                'call GetPatientList()'
            );

            return response()->json($data);
        }
        catch(Exception $exp)
        {
            throw $exp;
        }
    }

    public function GetAllergieByPatientId(Request $request)
    {
        try
        {

            $data=DB::select(

                "CALL GetAllergieByPatientId(?)",
                array(
                    $request->input('id')
                )
            );

            return response()->json($data);
        }
        catch(Exception $exp)
        {
            throw $exp;
        }
    }

    public function GetTraitementByPatientId(Request $request)
    {
        try
        {

            $data=DB::select(

                "CALL GetTraitementByPatientId(?)",
                array(
                    $request->input('id')
                )
            );

            return response()->json($data);
        }
        catch(Exception $exp)
        {
            throw $exp;
        }
    }

    public function listPatients()
    {
        // Récupérer tous les patients non supprimés
        $patients = DossierMedical::where('isDeleted', false)
            ->get(['idDossier', 'nomPatient']);

        return response()->json([
            'status' => 'success',
            'data' => $patients,
        ]);
    }

}
