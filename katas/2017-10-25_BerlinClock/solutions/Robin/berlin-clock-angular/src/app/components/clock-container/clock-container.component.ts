import { Component, OnInit } from '@angular/core';

/**
 * Component to contain the clock's DisplayComponent as well as a few
 * other elements that allow to change the time and see the result in
 * DisplayComponent.
 */
@Component({
  selector: 'app-clock-container',
  templateUrl: './clock-container.component.html',
  styleUrls: ['./clock-container.component.scss']
})
export class ClockContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
