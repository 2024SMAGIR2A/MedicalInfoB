import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSlot } from '../../services/appointment.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-medecin-disponible',
  templateUrl: './medecin-disponible.component.html',
  styleUrls: ['./medecin-disponible.component.css']
})
export class MedecinDisponibleComponent implements OnInit {
  timeSlots: TimeSlot[] = [];

  specialties = [
    { id: 1, name: 'Cardiologie' },
    { id: 2, name: 'Dermatologie' },
    { id: 3, name: 'Pédiatrie' },
    { id: 4, name: 'Ophtalmologie' }
  ];

  selectedSpecialty: number | null = null;
  selectedDate: Date | null = null;
  loading = false;
  error: string | null = null;
  bookingInProgress = false;
  bookingError: string | null = null;
  bookingSuccess: string | null = null;
  currentBookingId: number | null = null;
  patientId = 3;  // Default patient ID for testing
  bookedSlotId: number | null = null;  // Add this to track booked slot

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTimeSlots();
  }

  loadTimeSlots(): void {
    this.loading = true;
    const filters: { specialite?: number, date?: string } = {};

    if (this.selectedSpecialty) {
      filters.specialite = this.selectedSpecialty;
    }
    if (this.selectedDate) {
      // Format date as YYYY-MM-DD
      const date = new Date(this.selectedDate);
      filters.date = date.toISOString().slice(0, 10);
      console.log('Date filter:', filters.date); // Debug log
    }

    this.appointmentService.getAvailableTimeSlots(filters).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Debug log
        this.timeSlots = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error); // Debug log
        this.snackBar.open(
          'Erreur lors du chargement des créneaux disponibles',
          'Fermer',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
        this.loading = false;
      }
    });
  }

  // Add filter change handlers
  onFilterChange() {
    console.log('Date selected:', this.selectedDate); // Debug log
    this.loadTimeSlots();
  }

  bookAppointment(slot: TimeSlot): void {
    const patientId = 3; // Replace with actual patient ID

    this.appointmentService.bookTimeSlot(slot.id, patientId).subscribe({
      next: (response) => {
        if (response.state === 'success') {
          this.bookedSlotId = slot.id;
          this.snackBar.open('Rendez-vous réservé avec succès', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.loadTimeSlots();
        }
      },
      error: (errorResponse) => {
        this.snackBar.open(
          errorResponse.error.errorDetail || errorResponse.error.message,
          'Fermer',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  resetBooking() {
    this.bookedSlotId = null;
    this.bookingSuccess = null;
    this.bookingError = null;
    this.loadTimeSlots();
  }
}
