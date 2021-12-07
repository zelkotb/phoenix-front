import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Login } from 'src/app/model/login';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { Register } from '../../model/register';
import { RegisterService } from '../../services/register.service';
import {SnackBarFailureComponent} from '../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() type: string;
  mode: string = ""
  hide: boolean = true;
  hideRepeatPassword: boolean = true;
  loading: boolean = false;
  register: Register = new Register();
  login: Login = new Login();
  matcher = new MyErrorStateMatcher();
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', [Validators.required]),
    tel: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    acceptCGU: new FormControl('', Validators.required)
  },
    {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get('password').value;
        let confirmPass = group.get('repeatPassword').value
        return pass === confirmPass ? null : { notSame: true }
      }
    }
  );

  constructor(private router: Router, private registerService: RegisterService,
    private loginService: LoginService, private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.type != 'admin') {
      this.loginService.logout();
    }
  }

  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get repeatPassword() { return this.registerForm.get('repeatPassword'); }
  get tel() { return this.registerForm.get('tel'); }
  get acceptCGU() { return this.registerForm.get('acceptCGU'); }

  onSubmit() {
    this.mode = "indeterminate";
    this.loading = true;
    this.register.email = this.email.value;
    this.register.password = this.password.value;
    this.register.firstName = this.firstName.value;
    this.register.lastName = this.lastName.value;
    this.register.phone = this.tel.value;
    this.register.cguAccepted = this.acceptCGU.value;
    this.register.city = "CASABLANCA"
    this.registerService.register(this.register, this.type).subscribe(
      result => {
        this.loading = false;
        this.toLogin();
        this.openDialog();
      },
      error => {
        this.mode = "";
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  toLogin() {
    this.router.navigate([environment.base + "/login"]);
  }

  isPasswordConfirmationValid(): boolean {
    const password = this.password.value;
    const confirmPassword = this.repeatPassword.value;
    return password === confirmPassword ? true : false
  }

  openSnackBarFailure(message: string) {
    this._snackBar.openFromComponent(SnackBarFailureComponent, {
      data: message,
      panelClass: 'app-snack-bar-failure',
      duration: 5000
    });
  }

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
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

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.html',
})
export class DialogElementsExampleDialog { }
