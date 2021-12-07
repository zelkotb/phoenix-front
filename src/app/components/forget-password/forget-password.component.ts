import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgetPasswordRequest } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import {SnackBarSuccessComponent} from '../common/snack-bar-success/snack-bar-success.component';
import {SnackBarFailureComponent} from '../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  loading: boolean = false;
  forgetPasswordRequest: ForgetPasswordRequest = new ForgetPasswordRequest();
  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });
  constructor(private accountService: AccountService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>) { }

  ngOnInit(): void {
  }

  get email() { return this.forgetPasswordForm.get('email'); }

  onSubmit() {
    this.loading = true;
    this.forgetPasswordRequest.email = this.email.value;
    this.accountService.forgetPassword(this.forgetPasswordRequest).subscribe(
      result => {
        this.loading = false;
        this.openSnackBarSuccess("Un email vous a été envoyé");
        this.dialogRef.close();
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error)
      }
    )
  }

  openSnackBarSuccess(message: string) {
    this._snackBar.openFromComponent(SnackBarSuccessComponent, {
      data: message,
      panelClass: 'app-snack-bar-success',
      duration: 5000
    });
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }
}
