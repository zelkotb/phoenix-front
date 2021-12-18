import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { AccountListComponent } from './components/admin/account-list/account-list.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterBackOfficeComponent } from './components/admin/register-back-office/register-back-office.component';
import { ConfirmationComponent } from './components/common/confirmation/confirmation.component';
import { UpdateAccountComponent } from './components/update-account/update-account.component';
import { SpinnerComponent } from './components/common/spinner/spinner.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SnackBarSuccessComponent } from './components/common/snack-bar-success/snack-bar-success.component';
import { SnackBarFailureComponent } from './components/common/snack-bar-failure/snack-bar-failure.component';
import { ProductComponent } from './components/merchant/product/product.component';
import { CreateProductComponent } from './components/merchant/create-product/create-product.component';
import { DatePipe } from '@angular/common';
import { CategoryComponent } from './components/merchant/category/category.component';
import { ProductListComponent } from './components/merchant/product-list/product-list.component';
import { ProductListPhoenixComponent } from './components/merchant/product-list-phoenix/product-list-phoenix.component';
import { HistoriqueComponent } from './components/merchant/historique/historique.component';
import { HistoriquePhoenixComponent } from './components/merchant/historique-phoenix/historique-phoenix.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AccountListComponent,
    RegisterBackOfficeComponent,
    ConfirmationComponent,
    UpdateAccountComponent,
    SpinnerComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    SnackBarSuccessComponent,
    SnackBarFailureComponent,
    ProductComponent,
    CreateProductComponent,
    CategoryComponent,
    ProductListComponent,
    ProductListPhoenixComponent,
    HistoriqueComponent,
    HistoriquePhoenixComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
