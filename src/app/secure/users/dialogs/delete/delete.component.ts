import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdvanceTableService } from '../../users-table.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: AdvanceTableService
  ) {}
  confirmDelete(): void {
   //console.log(this.data);
    this.advanceTableService.deleteAdvanceTable(this.data.id).subscribe({
      next: (response) => {
        ////console.log('Delete Response:', response);
        this.dialogRef.close(response); // Close with the response data
        // Handle successful deletion, e.g., refresh the table or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle the error appropriately
      },
    });
  }
}
