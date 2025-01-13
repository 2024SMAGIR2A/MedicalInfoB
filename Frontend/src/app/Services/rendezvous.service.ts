import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RendezvousService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/rendezvous'; // Lien de l'API Laravel

  constructor(private http: HttpClient) {}

  prendreRendezVous(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getTypesRendezVous(): Observable<any> {  // La réponse est un objet avec une propriété `data`
    return this.http.get<any>('http://127.0.0.1:8000/api/user/typesrendezvous');
  }

  getMedecin(): Observable<any> {  // La réponse est un objet avec une propriété `data`
    return this.http.get<any>('http://127.0.0.1:8000/api/user/medecin');
  }
  
  getRendezVousByPatient(idPatient: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/user/rendezvous/patient/${idPatient}`);

    // return this.http.get(`${this.apiUrl}/rendezvous/patient/${idPatient}`);
  }

  getDemandesMedecin(idMedecin: number): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/api/user/medecin/1/demandes`);
  }

  // Valider un rendez-vous
  validerRendezVous(id: number): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8000/api/user/rendezvous/${id}/valider`, {});
  }

  // Refuser un rendez-vous
  refuserRendezVous(id: number): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8000/api/user/rendezvous/${id}/refuser`, {});
  }

  getDemandesAcceptees(): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/user/rendezvous/acceptes`);
  }

  // Récupérer les demandes rejetées
  getDemandesRejetees(): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/user/rendezvous/rejetes`);
  }
}
