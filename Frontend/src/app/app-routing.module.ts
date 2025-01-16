import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMedecinComponent } from './Medecin/dashboard-medecin/dashboard-medecin.component';
import { LoginComponent } from './login/login.component';
import { PatientListComponent } from './Medecin/patient-list/patient-list.component';
import { PatientDetailsComponent } from './Medecin/patient-details/patient-details.component';
import { AddExamenComponent } from './Medecin/add-examen/add-examen.component';
import { MedecinDisponibleComponent } from './Patient/medecin-disponible/medecin-disponible.component';
import { RendezvousComponent } from './Patient/rendezvous/rendezvous/rendezvous.component';
import { RendezvousListComponent } from './Patient/rendezvous/rendezvous-list/rendezvous-list.component';
import { RendezvousdemandeComponent } from './Medecin/rendezvousdemande/rendezvousdemande/rendezvousdemande.component';
import { RendezvousaccepteeComponent } from './Medecin/rendezvousdemande/rendezvousacceptee/rendezvousacceptee.component';
import { RendezvousrejeteeComponent } from './Medecin/rendezvousdemande/rendezvousrejetee/rendezvousrejetee.component';

const routes: Routes = [
  { path: 'DashboardMedecin', component: DashboardMedecinComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'PatientList', component: PatientListComponent },
  { path: 'PatientDetails', component: PatientDetailsComponent },
  { path: 'AddExamen', component: AddExamenComponent },
  { path: 'rdv', component: RendezvousComponent },
  { path: 'rdv/list', component: RendezvousListComponent },
  { path: 'rdv/confirm', component: RendezvousdemandeComponent },
  { path: 'rdv/accepte', component: RendezvousaccepteeComponent },
  { path: 'rdv/refuse', component: RendezvousrejeteeComponent },
  { path: 'patient/medecin-disponible', component: MedecinDisponibleComponent },
  { path: '', redirectTo: 'Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
