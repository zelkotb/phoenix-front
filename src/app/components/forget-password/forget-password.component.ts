import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgetPasswordRequest } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';

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
        this.openSnackBar("Un email vous a été envoyé", "Opération Réussie");
        this.dialogRef.close();
      },
      error => {
        this.loading = false;
        this.openSnackBar(error, "Erreur")
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['snackbar'],
    });
  }
}
