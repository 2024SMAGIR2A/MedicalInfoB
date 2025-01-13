import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedecinDisponibleComponent } from './Patient/medecin-disponible/medecin-disponible.component';

const routes: Routes = [
  {
    path: 'patient/medecin-disponible',
    component: MedecinDisponibleComponent
  },
  // Add other routes here
  {
    path: '',
    redirectTo: '/patient/medecin-disponible',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
