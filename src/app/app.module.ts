import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxWheelModule } from 'ngx-wheel';

import { AppComponent } from './app.component';
import { DigitalClockComponent } from './digital-clock/digital-clock.component';
import { HomeComponent } from './home/home.component';
import { DigitalTimerComponent } from './digital-timer/digital-timer.component';
import { ResultTableComponent } from './result-table/result-table.component';
import { AdminTasksComponent } from './admin-tasks/admin-tasks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';

const appRoutes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: 'admin', 
    component: AdminTasksComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '**',   
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DigitalClockComponent,
    DigitalTimerComponent,
    ResultTableComponent,
    AdminTasksComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgxWheelModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
