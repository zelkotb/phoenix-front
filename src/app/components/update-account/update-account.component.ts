import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAccountResponse, UpdateAccountRequest, UpdateAccountResponse } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ConfirmationComponent } from '../common/confirmation/confirmation.component';
import {SnackBarFailureComponent} from '../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent implements OnInit {

  updateAccountRequest: UpdateAccountRequest = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: ""
  };
  getAccountResponse: GetAccountResponse;
  updateAccountResponse: UpdateAccountResponse;
  id: number;
  loading: boolean;
  constructor(private accountService: AccountService,
    private route: ActivatedRoute, private _snackBar: MatSnackBar,
    private loginService: LoginService,
    public dialog: MatDialog,
    private router: Router) { }

  private routeSub: Subscription;
  ngOnInit(): void {
    this.loading = true;
    this.routeSub = this.route.params.subscribe(
      params => {
        this.id = params['id'];
        this.accountService.getAccount(this.id).subscribe(
          result => {
            this.getAccountResponse = result;
            this.updateAccountRequest = new UpdateAccountRequest();
            this.updateAccountRequest.email = this.getAccountResponse.email;
            this.updateAccountRequest.firstName = this.getAccountResponse.firstName;
            this.updateAccountRequest.lastName = this.getAccountResponse.lastName;
            this.updateAccountRequest.phone = this.getAccountResponse.phone;
            this.updateAccountRequest.city = this.getAccountResponse.city;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.openSnackBarFailure(error);
          }
        )
      }
    );
  }

  onSubmit(f: NgForm) {
    this.loading = true;
    this.accountService.updateAccount(this.updateAccountRequest, this.getAccountResponse.id).subscribe(
      result => {
        this.updateAccountResponse = result;
        this.updateAccountRequest.email = this.updateAccountResponse.email;
        this.updateAccountRequest.firstName = this.updateAccountResponse.firstName;
        this.updateAccountRequest.lastName = this.updateAccountResponse.lastName;
        this.updateAccountRequest.phone = this.updateAccountResponse.phone;
        this.updateAccountRequest.city = this.updateAccountResponse.city;
        if (this.updateAccountResponse.token != undefined && this.updateAccountResponse.token != "") {
          this.loginService.updateToken(this.updateAccountResponse.token, this.updateAccountResponse.email);
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

  openChangePasswordPopUp() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {
        id: this.id,
      },
    });
  }

  openDeleteAccountPopUp() {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de supprimer ce Compte !! ?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.accountService.deactivateAccount(this.id).subscribe(
          result => {
            this.router.navigate([environment.base + '/login']);
            this.loginService.logout();
          },
          error => {
            this.openSnackBarFailure(error);
          }
        )
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
