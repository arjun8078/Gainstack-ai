import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/shared/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent implements OnInit {

toasts$ :any

  constructor(private toastService: ToastService) {

  }

  ngOnInit(): void {

 this.toasts$ = this.toastService.toasts$;
  }
  removeToast(id: any) {
  this.toastService.removeToast(id);
}

}
