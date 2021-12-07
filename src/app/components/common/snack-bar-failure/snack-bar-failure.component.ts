import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-failure',
  templateUrl: './snack-bar-failure.component.html',
  styleUrls: ['./snack-bar-failure.component.css']
})
export class SnackBarFailureComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarFailureComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
