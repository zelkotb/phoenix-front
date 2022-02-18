import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePasswordRequest } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import {SnackBarSuccessComponent} from '../common/snack-bar-success/snack-bar-success.component';
import {SnackBarFailureComponent} from '../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  hide: boolean = true;
  hideOld: boolean = true;
  hideRepeatPassword: boolean = true;
  matcher = new MyErrorStateMatcher();
  changePasswordRequest: ChangePasswordRequest = new ChangePasswordRequest();
  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', [Validators.required]),
  },
    {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get('password').value;
        let confirmPass = group.get('repeatPassword').value
        return pass === confirmPass ? null : { notSame: true }
      }
    }
  );
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private accountService: AccountService, private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
  }
  get password() { return this.changePasswordForm.get('password'); }
  get repeatPassword() { return this.changePasswordForm.get('repeatPassword'); }
  get oldPassword() { return this.changePasswordForm.get('oldPassword'); }

  isPasswordConfirmationValid(): boolean {
    const password = this.password.value;
    const confirmPassword = this.repeatPassword.value;
    return password === confirmPassword ? true : false
  }

  onSubmit() {
    this.changePasswordRequest.oldPassword = this.oldPassword.value;
    this.changePasswordRequest.newPassword = this.password.value;
    this.accountService.changePassword(this.changePasswordRequest, this.data.id).subscribe(
      result => {
        this.openSnackBarSuccess("Mot de passe modifié");
        this.dialogRef.close();
      },
      error => {
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const password = form.form.get('password').value;
    const confirmPassword = form.form.get('repeatPassword').value;
    return !!(((password != confirmPassword) && (control.dirty || control.touched)) || control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface DialogData {
  id: number;
  comment: string;
}
