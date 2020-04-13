import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { ClockContainerComponent } from './components/clock-container/clock-container.component.tns';

export const routes: Routes = [
  { path: '', redirectTo: '/clock', pathMatch: 'full' },
  {
    path: 'clock',
    component: ClockContainerComponent,
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
