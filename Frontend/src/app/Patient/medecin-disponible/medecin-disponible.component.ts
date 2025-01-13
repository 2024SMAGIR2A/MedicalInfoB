import { Component, OnInit } from '@angular/core';
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

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadTimeSlots();
  }

  loadTimeSlots() {
    this.loading = true;
    this.error = null;

    const filters: { specialite?: number, date?: string } = {};
    if (this.selectedSpecialty) {
      filters.specialite = this.selectedSpecialty;
    }
    if (this.selectedDate) {
      filters.date = this.selectedDate.toISOString().split('T')[0];
    }

    this.appointmentService.getAvailableTimeSlots(filters).subscribe({
      next: (response) => {
        this.timeSlots = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des créneaux disponibles';
        this.loading = false;
        console.error('Error loading time slots:', error);
      }
    });
  }

  // Add filter change handlers
  onFilterChange() {
    this.loadTimeSlots();
  }

  bookAppointment(timeSlotId: number) {
    this.bookingInProgress = true;
    this.currentBookingId = timeSlotId;
    this.bookingError = null;
    this.bookingSuccess = null;

    this.appointmentService.bookTimeSlot(timeSlotId, this.patientId).subscribe({
      next: (response) => {
        if (response.state === 'success') {
          this.bookingSuccess = response.data;
          this.bookedSlotId = timeSlotId;  // Save the booked slot ID
          this.loadTimeSlots();
        } else {
          this.bookingError = response.message;
        }
        this.bookingInProgress = false;
        this.currentBookingId = null;

        if (this.bookingSuccess) {
          setTimeout(() => {
            this.bookingSuccess = null;
          }, 3000);
        }
      },
      error: (error) => {
        this.bookingError = 'Erreur lors de la réservation du rendez-vous';
        this.bookingInProgress = false;
        this.currentBookingId = null;
        console.error('Error booking appointment:', error);
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
