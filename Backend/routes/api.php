<?php


use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocteurController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RendezVousController;
// use App\Http\Controllers\UtilisController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });



Route::prefix('auth')->group(function () {
    Route::post('/login', action: [AuthController::class, 'login']);
    Route::post('/register', action: [AuthController::class, 'register']);
    Route::get('/users', action: [AuthController::class, 'show']);

});

Route::prefix('user')->group(function () {

    // Patient
    Route::post('patient/choose-time-slot', action: [PatientController::class, 'chooseTimeSlot']);
    Route::get('patient/choosed-time-slot', action: [PatientController::class, 'choosedTimeSlot']);


    Route::post('patient/ask-for-appointment', action: [PatientController::class, 'askForAppointment']);

    Route::post('/rendezvous', [RendezVousController::class, 'store']);
    Route::get('/typesrendezvous', [RendezVousController::class, 'getTypesRendezVous']);
    Route::get('/medecin', [RendezVousController::class, 'getMedecins']);
    Route::get('/rendezvous/patient/{idPatient}', [RendezVousController::class, 'getRendezVousByPatient']);
    Route::get('/medecin/{idMedecin}/demandes', [RendezVousController::class, 'getDemandesMedecin']);
    Route::post('/rendezvous/{id}/valider', [RendezVousController::class, 'validerRendezVous']);
    Route::post('/rendezvous/{id}/refuser', [RendezVousController::class, 'refuserRendezVous']);
    Route::get('/rendezvous/acceptes', [RendezVousController::class, 'getDemandesAcceptees']);
    // Route pour les demandes rejetées
    Route::get('/rendezvous/rejetes', [RendezVousController::class, 'getDemandesRejetees']);
    // Doctor
    Route::prefix('doctor')->group(function (){
        Route::post('addExamination', action: [DocteurController::class, 'addExamination']);
        Route::get('available/time-slot', [DocteurController::class, 'availableTimeSlot']);
    });

    // Lister les examens
    Route::get('doctor/listExaminations', [DocteurController::class, 'listExamens']);

    // Récupérer la liste des patients
    Route::get('patients', [DocteurController::class, 'listPatients']);

    // Récupérer la liste des types d'examens
    Route::get('examenTypes', [DocteurController::class, 'listTypeExamens']);
});






/*Role*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::get('/roles/{id}', [RoleController::class, 'show']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
});



// logout

Route::delete('/auth/logout', [AuthController::class, 'logout'])
    ->middleware(['auth:sanctum']);
