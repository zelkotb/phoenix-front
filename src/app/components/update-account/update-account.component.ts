import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAccountResponse, UpdateAccountRequest, UpdateAccountResponse } from 'src/app/model/account';
import { AccountService } from 'src/app/services/account.service';
import { LoginService } from 'src/app/services/login.service';

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
  loading: boolean = false;
  constructor(private accountService: AccountService,
    private route: ActivatedRoute, private _snackBar: MatSnackBar,
    private loginService: LoginService) { }

  private routeSub: Subscription;
  ngOnInit(): void {
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
          },
          error => {
            this.openSnackBar(error, "Erreur")
          }
        )
      }
    );
  }

  onSubmit(f: NgForm) {
    this.loading = false;
    this.accountService.updateAccount(this.updateAccountRequest, this.getAccountResponse.id).subscribe(
      result => {
        this.loading = false;
        this.updateAccountResponse = result;
        this.updateAccountRequest.email = this.updateAccountResponse.email;
        this.updateAccountRequest.firstName = this.updateAccountResponse.firstName;
        this.updateAccountRequest.lastName = this.updateAccountResponse.lastName;
        this.updateAccountRequest.phone = this.updateAccountResponse.phone;
        this.updateAccountRequest.city = this.updateAccountResponse.city;
        if (this.updateAccountResponse.token != undefined && this.updateAccountResponse.token != "") {
          this.loginService.updateToken(this.updateAccountResponse.token, this.updateAccountResponse.email);
        }
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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
