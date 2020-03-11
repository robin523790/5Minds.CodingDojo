import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClockContainerComponent } from './components/clock-container/clock-container.component';

const routes: Routes = [
  { path: '', redirectTo: '/clock', pathMatch: 'full' },
  {
    path: 'clock',
    component: ClockContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
