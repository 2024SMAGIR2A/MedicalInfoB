<?php

namespace App\Http\Helpers;

class ApiResponse {


    const INVALID_CREDENTIALS = 'INVALIDE CREDENTIALS';
    const BAD_REQUEST = 'BAD REQUEST PROVIDED';
    const UNAUTHORIZED = 'UNAUTHORIZED REQUEST';
    const OK = 'REQUEST WELL-DONE';
    const CREATED = 'DATA CREATED';
    const ACCEPTED = 'REQUEST ACCEPTED';
    const NOT_FOUND = 'DATA NOT FOUND';
    const FOUND = 'DATA FOUND';
    const SERVER_ERROR = "INTERNAL ERROR";
    const ALREADY_EXIST = "RESOURCES ALREADY EXIST";
    const NO_CONTENT = "NO CONTENT";

    public static function return_error_response($error, $errorDetail, $status) {

        return response()->json([
            'state' => 'error',
            'message'=> $error,
            'data' => null,
            'errorDetail' => $errorDetail
        ], $status);
    }

    public static function return_success_response($success, $data, $status) {

        return response()->json([
            'state' => 'success',
            'data' => $data,
            'message' => $success,
        ], $status);

    }

    public static function return_server_error_response() {

        $errorDetail='Une erreur est survenue. Veuillez réessayer';
        return response()->json([
            'state' => 'error',
            'data' => null,
            'message' => ApiResponse::SERVER_ERROR,
            'errorDetail' => $errorDetail
        ], 500);
    }

}
