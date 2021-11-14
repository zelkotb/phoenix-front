import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  color: string = "primary";
  mode: string = "indeterminate";
  diameter: number = 200;
  strokeWidth: number = 10;
  constructor() { }

  ngOnInit(): void {
  }

}
