import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { DashboardMedecinComponent } from './Medecin/dashboard-medecin/dashboard-medecin.component';

import localeFr from '@angular/common/locales/fr';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationService } from './Services/configuration.service';
import { HttpClientModule } from '@angular/common/http';
import { RequesterService } from './Services/requester.service';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SidebarComponent } from './Layouts/sidebar/sidebar.component';
import { HeaderComponent } from './Layouts/header/header.component';
import { FooterComponent } from './Layouts/footer/footer.component';
import { MainHeaderComponent } from './Layouts/main-header/main-header.component';
import { PatientListComponent } from './Medecin/patient-list/patient-list.component';
import { PatientDetailsComponent } from './Medecin/patient-details/patient-details.component';
import { AddExamenComponent } from './Medecin/add-examen/add-examen.component';
import { RendezvousComponent } from './Patient/rendezvous/rendezvous/rendezvous.component';
import { RendezvousListComponent } from './Patient/rendezvous/rendezvous-list/rendezvous-list.component';
import { RendezvousdemandeComponent } from './Medecin/rendezvousdemande/rendezvousdemande/rendezvousdemande.component';
import { RendezvousaccepteeComponent } from './Medecin/rendezvousdemande/rendezvousacceptee/rendezvousacceptee.component';
import { RendezvousrejeteeComponent } from './Medecin/rendezvousdemande/rendezvousrejetee/rendezvousrejetee.component';
// import { PatientCreateComponent } from './patient/patient-create/patient-create.component';
// import { PatientListComponent } from './patient/patient-list/patient-list.component';



registerLocaleData(localeFr, 'fr');

const appRoutes: Routes = [
  { path: 'DashboardMedecin', component: DashboardMedecinComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'Login', component: LoginComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'PatientList', component: PatientListComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
  { path: 'PatientDetails/:idUtilisateur', component: PatientDetailsComponent }, //, canActivate :[SessionGuard],},//, canActivate :[SessionGuard],},
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
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    MainHeaderComponent,
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
    AppRoutingModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "fr-FR" },

    {
      provide: APP_INITIALIZER,
      useFactory: initServicesFactory,
      multi : true,
      deps: [ConfigurationService],
    },

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { }
