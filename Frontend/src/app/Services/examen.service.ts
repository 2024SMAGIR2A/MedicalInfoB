import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamenService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/doctor/addExamination'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter un examen
  addExamen(examenData: any): Observable<any> {
    return this.http.post(this.apiUrl, examenData);
  }
}
