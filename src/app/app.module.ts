import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings.component';
import { CountriesComponent } from './components/countries.component';
import { NewsCountriesComponent } from './components/news-countries.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main.component';
import { NewsDatabase } from './news.database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'topheadlinenews/:country/:countryCode', component: NewsCountriesComponent },
  { path: '**', redirectTo: '/', pathMatch:'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    CountriesComponent,
    NewsCountriesComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [NewsDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
