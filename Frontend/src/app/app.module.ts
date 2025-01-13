import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import { ConfigurationService } from './Services/configuration.service';
import { HttpClientModule } from '@angular/common/http';
import { RequesterService } from './Services/requester.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './Layouts/header/header.component';
import { FooterComponent } from './Layouts/footer/footer.component';
import { SidebarComponent } from './Layouts/sidebar/sidebar.component';
import { MainHeaderComponent } from './Layouts/main-header/main-header.component';
import { MedecinDisponibleComponent } from './Patient/medecin-disponible/medecin-disponible.component';
import { PatientListComponent } from './Medecin/patient-list/patient-list.component';
import { PatientDetailsComponent } from './Medecin/patient-details/patient-details.component';
import { AddExamenComponent } from './Medecin/add-examen/add-examen.component';
import { RendezvousComponent } from './Patient/rendezvous/rendezvous/rendezvous.component';
import { RendezvousListComponent } from './Patient/rendezvous/rendezvous-list/rendezvous-list.component';
import { RendezvousdemandeComponent } from './Medecin/rendezvousdemande/rendezvousdemande/rendezvousdemande.component';
import { RendezvousaccepteeComponent } from './Medecin/rendezvousdemande/rendezvousacceptee/rendezvousacceptee.component';
import { RendezvousrejeteeComponent } from './Medecin/rendezvousdemande/rendezvousrejetee/rendezvousrejetee.component';
import { DashboardMedecinComponent } from './Medecin/dashboard-medecin/dashboard-medecin.component';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { PatientCreateComponent } from './patient/patient-create/patient-create.component';
// import { PatientListComponent } from './patient/patient-list/patient-list.component';



registerLocaleData(localeFr, 'fr');

const appRoutes: Routes = [
  { path: 'DashboardMedecin', component: DashboardMedecinComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'Login', component: LoginComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'PatientList', component: PatientListComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'PatientDetails', component: PatientDetailsComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'AddExamen', component:  AddExamenComponent}, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},

  { path: 'rdv', component: RendezvousComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'rdv/list', component: RendezvousListComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'rdv/confirm', component: RendezvousdemandeComponent },
  { path: 'rdv/accepte', component: RendezvousaccepteeComponent },
  { path: 'rdv/refuse', component: RendezvousrejeteeComponent },


  {path: '', redirectTo: 'Login', pathMatch:"prefix" },

]

export function initServicesFactory(
  configurationService: ConfigurationService,requesterService : RequesterService
) {
  return async () => {
    // console.log('initServicesFactory - started');
    const config = await configurationService.loadConfiguration();
    // RequesterService.RouteBaseApi = config.RouteBaseApi
    // console.log(requesterService.RouteBaseApi)
    // console.log('initServicesFactory - completed',config.RouteBaseApi);
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainHeaderComponent,
    MedecinDisponibleComponent,
    PatientListComponent,
    PatientDetailsComponent,
    RendezvousComponent,
    RendezvousListComponent,
    RendezvousdemandeComponent,
    RendezvousrejeteeComponent,
    RendezvousaccepteeComponent,
    AddExamenComponent,
    // PatientCreateComponent,
    // PatientListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    // Material Modules
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }  // For French date format
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
