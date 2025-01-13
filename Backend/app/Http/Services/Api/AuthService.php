<?php

namespace App\Http\Services\Api;

use App\Http\Constants\GlobalConst;
use App\Http\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthService {

    function __construct()
    {

    }


    public function login(array $userLoginData)  {


        try {


            // mettre l'email en minuscule
            $email = strtolower($userLoginData['email']);

            // Récupérer l'utilisateur par email
            // $user = User::where('email', $email)->first();

            $user = DB::table('Utilisateur')->where('email', $email)->first();

            // Vérifier si l'utilisateur existe
            if (!$user) {

                $errorDetail = 'Aucun utilisateur trouvé';

                return ApiResponse::return_error_response(ApiResponse::INVALID_CREDENTIALS, $errorDetail, 404);

            }


            // Vérifier si le mot de passe correspond
            if (!Hash::check($userLoginData['password'], $user->motDePasse)) {

                $message = ApiResponse::INVALID_CREDENTIALS;
                $errorDetail = 'Aucun utilisateur trouvé';

                return ApiResponse::return_error_response($message, $errorDetail, 401);

            }

            // Authentification réussie, générer le token JWT
            // $token = $user->createToken('accessToken')->plainTextToken;

            // set last_login avec la date et l'heure actuelles
            // $user->userLogs()->create([
            //     'ip' => $userLoginData['ip'],
            //     'action' => GlobalConst::ACTION_LOGIN,
            // ]);

            $data = [
                'user' => $user
            ];



            return ApiResponse::return_success_response(ApiResponse::OK, $data, 200);



        } catch (\Throwable $th) {

            // Gérer les éventuelles erreurs
            Log::error('Error occured when user tried to login. ' . $th->getMessage());

            return ApiResponse::return_server_error_response();

        }


    }

}
