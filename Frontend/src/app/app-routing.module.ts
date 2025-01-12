import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PatientCreateComponent } from './patient/patient-create/patient-create.component';
// import { PatientListComponent } from './patient/patient-list/patient-list.component';
import { DashboardMedecinComponent } from './Medecin/dashboard-medecin/dashboard-medecin.component';

const routes: Routes = [
  // { path: '', redirectTo: '/DashboardMedecin', pathMatch: 'full' },
  // { path: 'Patient/PatientCreate', component: PatientCreateComponent },
  // { path: 'Patient/PatientList', component: PatientListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
