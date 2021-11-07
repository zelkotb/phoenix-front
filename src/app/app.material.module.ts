import { NgModule } from "@angular/core";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
    imports: [
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSnackBarModule,
        MatChipsModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatProgressBarModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ],
    exports: [
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSnackBarModule,
        MatChipsModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatProgressBarModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ]
})
export class MaterialModule { }