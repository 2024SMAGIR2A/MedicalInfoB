import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TimeSlot {
  id: number;
  medecin: {
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
  };
  debut: Date;
  fin: Date;
}

export interface TimeSlotResponse {
  status: string;
  message: string;
  data: TimeSlot[];
}

export interface BookingResponse {
  state: string;
  data: string;
  message: string;
}

export interface BookingRequest {
  timeSlotId: number;
  patientId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/user';

  constructor(private http: HttpClient) { }

  getAvailableTimeSlots(filters?: { specialite?: number, date?: string }): Observable<TimeSlotResponse> {
    let url = `${this.apiUrl}/doctor/available/time-slot`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.specialite) params.append('specialite', filters.specialite.toString());
      if (filters.date) params.append('date', filters.date);
      url += `?${params.toString()}`;
    }
    return this.http.get<TimeSlotResponse>(url);
  }

  bookTimeSlot(timeSlotId: number, patientId: number): Observable<BookingResponse> {
    const bookingData: BookingRequest = {
      timeSlotId,
      patientId
    };

    return this.http.post<BookingResponse>(
      `${this.apiUrl}/patient/choose-time-slot`,
      bookingData
    );
  }
}
