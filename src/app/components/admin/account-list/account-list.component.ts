import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Account, AccountTable } from '../../../model/account';
import { AccountService } from '../../../services/account.service';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import {SnackBarSuccessComponent} from '../../common/snack-bar-success/snack-bar-success.component';
import {SnackBarFailureComponent} from '../../common/snack-bar-failure/snack-bar-failure.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, AfterViewInit {

  loading: boolean;
  displayedColumns: string[] = [
    'id',
    'email',
    'phone',
    'lastName',
    'firstName',
    'city',
    'roles',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<AccountTable>;
  accounts: Account[];
  accountsTable: AccountTable[] = [];
  accountTable: AccountTable = new AccountTable();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private accountService: AccountService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountService.accountList().subscribe(
      result => {
        this.accounts = result;
        for (let i = 0; i < this.accounts.length; i++) {
          this.accountTable.id = this.accounts[i].id;
          this.accountTable.email = this.accounts[i].email;
          this.accountTable.phone = this.accounts[i].phone;
          this.accountTable.lastName = this.accounts[i].lastName;
          this.accountTable.firstName = this.accounts[i].firstName;
          if (String(this.accounts[i].active) === "false") {
            this.accountTable.active = "Inactif";
          } else {
            this.accountTable.active = "Actif";
          }
          this.accountTable.city = this.accounts[i].city;
          this.accountTable.roles = this.accounts[i].roles.filter(Boolean).join(", ");

          this.accountsTable.push(Object.assign({}, this.accountTable));
        }
        this.dataSource = new MatTableDataSource(this.accountsTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.openSnackBarFailure(error);
      }
    )
  }

  ngAfterViewInit() {
    if (this.dataSource != undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteAccount(row: AccountTable) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de supprimer ce Compte avec id : "
          + row.id + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.accountService.deleteAccount(row.id).subscribe(
          result => {
            let index = this.accountsTable.indexOf(row);
            this.accountsTable.splice(index, 1);
            this.accounts.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.accountsTable);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            this.openSnackBarFailure(error);
          }
        )
      }
    });
  }

  regeneratePassword(id: number) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr que de générer un nouveau mot de passe pour ce Compte avec id : "
          + id + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.accountService.generatePassword(id).subscribe(
          result => {
            this.openSnackBarSuccess("Le mot de passe a été généré");
          },
          error => {
            this.openSnackBarFailure(error);
          }
        );
      }
    });
  }

  isDeletable(roles: string) {
    return !(roles.includes("E_MERCHANT") || roles.includes("ADMIN"));
  }

  deactivateAccount(row) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de desactiver ce Compte avec id : "
          + row.id + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.accountService.deactivateAccountForAdmin(row.id).subscribe(
          result => {
            let index = this.accountsTable.indexOf(row);
            this.accountsTable[index].active = "Inactif";
            this.accounts[index].active = false;
            this.dataSource = new MatTableDataSource(this.accountsTable);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.openSnackBarSuccess("Le compte est desactivé");
          },
          error => {
            this.openSnackBarFailure(error);
          }
        );
      }
    });
  }

  activateAccount(row) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        text:
          "Êtes-Vous sûr de activer ce Compte avec id : "
          + row.id + "?",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "confirmed") {
        this.accountService.activateAccountForAdmin(row.id).subscribe(
          result => {
            let index = this.accountsTable.indexOf(row);
            this.accountsTable[index].active = "Actif";
            this.accounts[index].active = true;
            this.dataSource = new MatTableDataSource(this.accountsTable);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.openSnackBarSuccess("Le compte est activé");
          },
          error => {
            this.openSnackBarFailure(error);
          }
        );
      }
    });
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
