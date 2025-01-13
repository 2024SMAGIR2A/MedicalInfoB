<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\Api\UtilisateurService;

class DocteurController extends Controller
{
    protected $utilisateurService;

    public function __construct(UtilisateurService $utilisateurService)
    {
        $this->utilisateurService = $utilisateurService;
    }

    public function availableTimeSlot(Request $request)
    {
        $filters = $request->only([
            'specialite',
            'medecin',
            'date'
        ]);

        return $this->utilisateurService->getTimeSlot($filters);
    }
}
