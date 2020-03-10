import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayComponent } from './components/display/display.component';

const routes: Routes = [
  { path: '', redirectTo: '/clock', pathMatch: 'full' },
  {
    path: 'clock',
    component: DisplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
