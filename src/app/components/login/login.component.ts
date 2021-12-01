import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Login } from 'src/app/model/login';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../services/login.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mode: string = "";
  hide: boolean = true;
  loading: boolean = false;
  login: Login = new Login();
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });
  constructor(private loginService: LoginService, private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loginService.logout();
  }

  get password() { return this.loginForm.get('password'); }
  get email() { return this.loginForm.get('email'); }
  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.login.email = this.email.value;
    this.login.password = this.password.value;
    this.loginService.login(this.login).subscribe(
      result => {
        this.loginService.setToken(result.token, result.userId, JSON.stringify(result.roles), result.id);
        this.mode = "";
        this.loading = false;
        this.routeAfterLogin(result.id);
      },
      error => {
        this.mode = "";
        this.loading = false;
        this.openSnackBar(error, "Erreur")
      }
    )
  }

  routeAfterLogin(id: number) {
    if (this.loginService.isAdmin()) {
      this.router.navigate([environment.base + '/accounts']);
    }
    else if (this.loginService.isMerchant) {
      this.router.navigate([environment.base + '/accounts/'+id]);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['snackbar'],
    });
  }

  forgetPasswordPopUp() {
    this.dialog.open(ForgetPasswordComponent);
  }
}
