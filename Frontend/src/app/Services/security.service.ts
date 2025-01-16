import { Injectable } from '@angular/core';
import { RequesterService } from './requester.service';
import { EnumEndpoints } from '../Enum/enum-endpoints';
import { Router } from '@angular/router';
import { UserModel } from '../Models/user-model.model';

interface LoginResponse {
  state: string;
  data: {
    user: {
      idUtilisateur: number;
      idRole: number;
      idSpecialite: number;
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
    };
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private RequesterService : RequesterService,
    private Router : Router
  ) { }


  CheckAuthOld()
    {
      // var IsAuth=0
      // if(localStorage.getItem('CurrentUser')!=null)
      // {
      //   var User : UserModel  = JSON.parse(localStorage.getItem('CurrentUser')!)
      // }
      this.SessionMangerOld()
      var IsAuth = Number(localStorage.getItem('IsAuth'))
      return IsAuth
    }

    CheckAuth()
    {
      var IsAuth=false
      if(localStorage.getItem('CurrentUser')!=undefined)
      {
        var User : UserModel  = JSON.parse(localStorage.getItem('CurrentUser')!)
        IsAuth=this.SessionManger(User)
      }
      return IsAuth
    }

    SessionManger(User : UserModel)
    {
        var hours = 1; // Reset when storage is more than 1hours
        var now = new Date().getTime();
        var setupTime = User.TimeToEndSession
        var StayConnect =false


        if(now-Number(setupTime) < hours*60*60*1000)
        {
          User.TimeToEndSession=now.toString()
          StayConnect=true
        }
        else
        {
          localStorage.removeItem('CurrentUser')
          User.TimeToEndSession=now.toString()
          localStorage.setItem('CurrentUser', JSON.stringify(User))
          StayConnect=false;
        }

        return StayConnect
    }

  SessionMangerOld()
    {
      var hours = 1; // Reset when storage is more than 1hours
        var now = new Date().getTime();
        var setupTime = localStorage.getItem('setupTime');
        var StayConnect =false
        if (setupTime == null) {
            localStorage.setItem('setupTime', now.toString())
            StayConnect=true
        } else {
            if(now-Number(setupTime) > hours*60*60*1000) {
                localStorage.clear()
                localStorage.setItem('setupTime', now.toString());
                StayConnect=false;

            }
        }
        return StayConnect
    }

  async Login(credentials: { email: string; password: string }) {
    try {
      const response = await this.RequesterService.AsyncPostResponse<LoginResponse>(
        'http://127.0.0.1:8000/api/auth/login',
        credentials,
        false,
        true,
        false
      );

      if (response && response.state === 'success') {
        const user = new UserModel();
        user.email = credentials.email;
        user.id = response.data.user.idUtilisateur;
        user.role = response.data.user.idRole;
        user.nom = response.data.user.nom;
        user.prenom = response.data.user.prenom;
        user.specialite = response.data.user.idSpecialite;
        user.TimeToEndSession = new Date().getTime().toString();

        localStorage.removeItem('CurrentUser');
        localStorage.setItem('CurrentUser', JSON.stringify(user));

        // Navigate based on role
        if (user.role === 1) { // Assuming 1 is for doctors
          this.Router.navigateByUrl('DashboardMedecin');
        } else {
          this.Router.navigateByUrl('patient/medecin-disponible');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  Logout() {
    localStorage.clear();  // Clear all localStorage
    this.navigate('');    // Navigate to login page
  }

  public navigate(path: string): void {
    this.Router.navigateByUrl(path);
  }

}
