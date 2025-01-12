<?php

namespace App\Http\Controllers\Api;

use App\Http\Constants\GlobalConst;
use App\Http\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Services\Api\AuthService;
use App\Http\Services\UserService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="API Documentation",
 *     description="API Documentation for Authentification",
 *     @OA\Contact(name = "Hugo", email = "l5wJt@example.com")
 *)
 */
class AuthController extends Controller
{

    public $successResponse;
    public $errorResponse;
    private $userService;

    private AuthService $authService;

    public function __construct(UserService $userService)
    {
        $this->successResponse = null;
        $this->errorResponse = null;
        $this->userService = $userService;
        $this->authService = new AuthService();

    }


    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     summary="Login user and return JWT token",
     *     tags={"Authentication"},
     *     description="Authentifie l'utilisateur en utilisant l'email et le mot de passe, et retourne un token JWT si l'authentification réussit.",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Email et mot de passe nécessaires pour la connexion",
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Connexion réussie",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="REQUEST ACCEPTED"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="accessToken", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Mot de passe incorrect ou utilisateur non trouvé",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Aucun utilisateur trouvé"),
     *             @OA\Property(property="code", type="string", example="INVALIDE CREDENTIALS"),
     *             @OA\Property(property="status", type="integer", example=401)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Utilisateur non trouvé",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Aucun utilisateur trouvé"),
     *             @OA\Property(property="code", type="string", example="INVALIDE CREDENTIALS"),
     *             @OA\Property(property="status", type="integer", example=404)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation échouée",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="array", example=["Veuillez remplir tous les champs."]),
     *             @OA\Property(property="code", type="string", example="INVALIDE CREDENTIALS"),
     *             @OA\Property(property="status", type="integer", example=422)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erreur serveur",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erreur interne du serveur"),
     *             @OA\Property(property="code", type="string", example="INTERNAL ERROR"),
     *             @OA\Property(property="status", type="integer", example=500)
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {
        //


        $errorDetail = '';

        // Valider les données de la requête
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [

            'email.required' => 'L\'email est requis.',
            'email.email' => 'L\'email n\'est pas valide.',
            'password.required' => 'Le mot de passe est requis.',
        ]);


        // erreur de validation
        if ($validator->fails()) {

            $errorDetail = $validator->errors()->messages();

            return ApiResponse::return_error_response(ApiResponse::INVALID_CREDENTIALS, $errorDetail, 422);

        }


        $userLoginData = [
            'email' => $request->email,
            'password' => $request->password,
            'ip'    => $request->ip()
        ];

        $result = $this->authService->login($userLoginData);


        return $result;
    }

       /**
 * @OA\Post(
 *     path="/api/auth/register",
 *     summary="Ajouter un nouveau utilisateur",
 *     tags={"User"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="name", type="string", example="Xavi"),
 *             @OA\Property(property="email", type="string", example="xavi@gmail.com"),
 *             @OA\Property(property="password", type="string", example="Barça12345"),
 *             @OA\Property(property="date_of_birth", type="string", format="date", example="1987-07-25"),
 *             @OA\Property(property="gender", type="string", example="M"),
 *             @OA\Property(property="phone_number", type="string", example="0102030405"),
 *             @OA\Property(property="address", type="string", example="Barcelone"),
 *             @OA\Property(property="role_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Utilisateur enregistré",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Utilisateur enregistré"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Erreur interne du serveur"),
 *             @OA\Property(property="code", type="string", example="INTERNAL ERROR"),
 *             @OA\Property(property="status", type="integer", example=500)
 *         )
 *     )
 * )
 */

    public function register(Request $request)
    {
        //
        try {
            $user = $this->userService->registerUser($request->all());
            $message = ApiResponse::CREATED;
            return ApiResponse::return_success_response($message, $user, 200);
        } catch (\Throwable $e) {
            Log::error('Error occurred when user tried to register. ' . $e->getMessage());
            return ApiResponse::return_server_error_response();
        }
    }



    /**
 * @OA\Get(
 *     path="/api/auth/users",
 *     summary="Liste des users",
 *     tags={"User"},
 *     @OA\Response(
 *         response=200,
 *         description="Liste des users",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="John Doe"),
 *                     @OA\Property(property="email", type="string", example="john.doe@example.com"),
 *                     @OA\Property(property="created_at", type="string", example="2024-09-30 12:34:56"),
 *                     @OA\Property(property="updated_at", type="string", example="2024-09-30 12:34:56")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error"
 *     )
 * )
 */



    /**
     * @OA\Delete(
     *     path="/api/logout",
     *     tags={"Logout"},
     *     summary="Logout",
     *     description="Deconnecter l'utilisateur",
     *
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="OK"),
     *             @OA\Property(property="code", type="string", example="OK"),
     *             @OA\Property(property="status", type="integer", example=200)
     *             )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erreur interne du serveur"),
     *             @OA\Property(property="code", type="string", example="INTERNAL ERROR"),
     *             @OA\Property(property="status", type="integer", example=500)
     *           )
     *    )
     *    )
    */
    // public function logout(Request $request){
    //     try {
    //         // Récupérer l'utilisateur actuellement authentifié
    //         $user = auth()->user();

    //         // Mettre à jour le champ last_logout avec la date et l'heure actuelles
    //         // $user->userLogs()->create([
    //         //     'action' => GlobalConst::ACTION_LOGOUT,
    //         //     'ip' => $request->ip(),
    //         // ]);

    //         // Révoquer tous les jetons d'authentification associés à l'utilisateur
    //         $user->tokens()->delete();

    //         $message = ApiResponse::OK;
    //         return ApiResponse::return_success_response($message, null, 202);

    //     } catch (Throwable $th) {

    //         // Gérer les éventuelles erreurs
    //         Log::error("Error while logout : ".$th->getMessage());

    //         return ApiResponse::return_server_error_response();

    //     }
    // }
}
