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
import { UpdateProductComponent } from './components/merchant/update-product/update-product.component';
import { UpdateQuantityComponent } from './components/merchant/update-quantity/update-quantity.component';
import { GenerateDocumentComponent } from './components/merchant/generate-document/generate-document.component';
import { DelivaryNoteComponent } from './components/merchant/note/delivary-note/delivary-note.component';
import { DocumentListComponent } from './components/admin/document-list/document-list.component';
import { DocumentHistoryComponent } from './components/merchant/document-history/document-history.component';
import { CreateOrderComponent } from './components/merchant/order/create-order/create-order.component';
import { OrderComponent } from './components/merchant/order/order/order.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductQuantityComponent } from './components/merchant/order/product-quantity/product-quantity.component';
import { ConfirmOrderComponent } from './components/merchant/order/confirm-order/confirm-order.component';
import { ListOrderComponent } from './components/merchant/order/list-order/list-order.component';
import { OrderDocumentComponent } from './components/merchant/order/order-document/order-document.component';
import { OrderAdminComponent } from './components/admin/orders/order-admin/order-admin.component';
import { OrderInWaitComponent } from './components/admin/orders/order-in-wait/order-in-wait.component';
import { OrderInWaitToPickUpComponent } from './components/admin/orders/order-in-wait-to-pick-up/order-in-wait-to-pick-up.component';
import { OrderInWaitDetailsComponent } from './components/admin/orders/order-in-wait-details/order-in-wait-details.component';
import { OrderPickedUpComponent } from './components/admin/orders/order-picked-up/order-picked-up.component';
import { OrderPickedUpValidationDetailsComponent } from './components/admin/orders/order-picked-up-validation-details/order-picked-up-validation-details.component';
import { OrderShippedComponent } from './components/admin/orders/order-shipped/order-shipped.component';
import { OrderInDistributionComponent } from './components/admin/orders/order-in-distribution/order-in-distribution.component';
import { HistoryComponent } from './components/admin/orders/history/history.component';
import { BLOrderPerCityPopupComponent } from './components/admin/orders/blorder-per-city-popup/blorder-per-city-popup.component';
import { OrderValidatedComponent } from './components/admin/orders/order-validated/order-validated.component';
import { OrderCommentPopupComponent } from './components/admin/orders/order-comment-popup/order-comment-popup.component';
import { OrderRefusedOrCanceledComponent } from './components/admin/orders/order-refused-or-canceled/order-refused-or-canceled.component';
import { OrderReturnedComponent } from './components/admin/orders/order-returned/order-returned.component';
import { OrderCommentInDistributionComponent } from './components/admin/orders/order-comment-in-distribution/order-comment-in-distribution.component';


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
    HistoriquePhoenixComponent,
    UpdateProductComponent,
    UpdateQuantityComponent,
    GenerateDocumentComponent,
    DelivaryNoteComponent,
    DocumentListComponent,
    DocumentHistoryComponent,
    CreateOrderComponent,
    OrderComponent,
    ProductQuantityComponent,
    ConfirmOrderComponent,
    ListOrderComponent,
    OrderDocumentComponent,
    OrderAdminComponent,
    OrderInWaitComponent,
    OrderInWaitToPickUpComponent,
    OrderInWaitDetailsComponent,
    OrderPickedUpComponent,
    OrderPickedUpValidationDetailsComponent,
    OrderShippedComponent,
    OrderInDistributionComponent,
    HistoryComponent,
    BLOrderPerCityPopupComponent,
    OrderValidatedComponent,
    OrderCommentPopupComponent,
    OrderRefusedOrCanceledComponent,
    OrderReturnedComponent,
    OrderCommentInDistributionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
