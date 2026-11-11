import { Routes } from '@angular/router';
import { TripList } from './components/trip-list/trip-list';
import { AddTrip } from './components/add-trip/add-trip';
import { EditTrip } from './components/edit-trip/edit-trip';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: TripList },
  { path: 'add', component: AddTrip },
  { path: 'edit', component: EditTrip },
  { path: 'login', component: Login }
];
