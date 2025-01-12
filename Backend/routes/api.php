<?php


use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocteurController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    Route::post('patient/ask-for-appointment', action: [PatientController::class, 'askForAppointment']);

    // Doctor
    Route::post('doctor/addExamination', action: [DocteurController::class, 'addExamination']);
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
