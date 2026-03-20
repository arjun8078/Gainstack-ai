import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(
    title: string,
    message: string,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { title, message, confirmText, cancelText }
    });

    return dialogRef.afterClosed();
  }
}
