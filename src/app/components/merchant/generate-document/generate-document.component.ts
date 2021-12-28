import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-generate-document',
  templateUrl: './generate-document.component.html',
  styleUrls: ['./generate-document.component.css']
})
export class GenerateDocumentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GenerateDocumentComponent>) { }

  ngOnInit(): void {
  }

}
