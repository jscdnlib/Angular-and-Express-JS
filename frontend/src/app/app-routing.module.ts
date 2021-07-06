import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KaryawanListComponent } from './components/karyawan/karyawan-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'karyawan', pathMatch: 'full' },
  { path: 'karyawan', component: KaryawanListComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
