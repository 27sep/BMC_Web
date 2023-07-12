import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperadminModule } from './superadmin/superadmin.module';
import { WebModule } from './web/web.module';
import { CommonService } from './service/common.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './superadmin/auth-guard/auth.service';
import { RouterModule, Routes } from '@angular/router';
import { PitViewComponent } from './superadmin/mcc/pit-view/pit-view.component';
import { MrfComponent } from './superadmin/mrf/mrf.component';
import { DryingYardMasterComponent } from './superadmin/drying-yard-master/drying-yard-master.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginGuard } from './superadmin/auth-guard/LoginGuard';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MiniSidebarComponent } from './superadmin/common/mini-sidebar/mini-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    MiniSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SuperadminModule,
    WebModule,
    HttpClientModule,
    NgbAlertModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["http://15.207.62.200/"],
        disallowedRoutes: ["http://15.207.62.200/"],
      },
    }),
  ],
  providers: [
    AuthService,CommonService,DatePipe,
    { provide: LoginGuard, useClass: LoginGuard },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})

// const routes: Routes = [
//   {path:'pit-view', component: PitViewComponent,canActivate:[AuthService]},
//   {path:'mrf', component: MrfComponent},
//   {path:'drying-yard', component: DryingYardMasterComponent},
//   {path:'drying-yard', component: DryingYardMasterComponent},
// ];

export class AppModule { }
export function tokenGetter() {
  return localStorage.getItem("access_token");
}

