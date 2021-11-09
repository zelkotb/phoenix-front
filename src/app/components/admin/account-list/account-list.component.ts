import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Account, AccountTable } from '../../../model/account';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'email',
    'phone',
    'lastName',
    'firstName',
    'city',
    'roles',
    'actions'
  ];
  dataSource: MatTableDataSource<AccountTable>;
  accounts: Account[];
  accountsTable: AccountTable[] = [];
  accountTable: AccountTable = new AccountTable();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private accountService: AccountService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.accountService.accountList().subscribe(
      result => {
        this.accounts = result;
        for (var account of this.accounts) {
          this.accountTable.id = account.id;
          this.accountTable.email = account.email;
          this.accountTable.phone = account.phone;
          this.accountTable.lastName = account.lastName;
          this.accountTable.firstName = account.firstName;
          this.accountTable.city = account.city;
          this.accountTable.roles = account.roles.filter(Boolean).join(", ");
          this.accountsTable.push(Object.assign({}, this.accountTable));
        }
        this.dataSource = new MatTableDataSource(this.accountsTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.openSnackBar(error, "Erreur")
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
    this.accountService.deleteAccount(row.id).subscribe(
      result => {
        this.accountsTable.splice(this.accountsTable.indexOf(row), 1);
        this.dataSource = new MatTableDataSource(this.accountsTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.openSnackBar(error, "Erreur")
      }
    )
  }

  regeneratePassword(id: number) {
    console.log(id);
  }

  isDeletable(roles: string) {
    return !(roles.includes("E_MERCHANT") || roles.includes("ADMIN"));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['snackbar'],
    });
  }

}
