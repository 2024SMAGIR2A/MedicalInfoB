<?php

    namespace App\Http\Constants;


    class GlobalConst
    {
        const ACTION_LOGIN = 'login';
        const ACTION_LOGOUT = 'logout';

        // Type de rendez-vous
        const CONSULTATION = 1;
        const URGENCE = 2;
        const SUIVI = 3;
        const VACCINATION = 4;
        const CONTROLE = 5;
    }
