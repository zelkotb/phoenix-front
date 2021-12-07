import { Component, OnInit,Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-snack-bar-success',
  templateUrl: './snack-bar-success.component.html',
  styleUrls: ['./snack-bar-success.component.css']
})
export class SnackBarSuccessComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarSuccessComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

}
