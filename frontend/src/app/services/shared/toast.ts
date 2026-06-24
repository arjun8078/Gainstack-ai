import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ToastMessage{
  id:string | Number,
  message:string,
  type: 'success' | 'error' | 'warning'
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$=this.toastSubject.asObservable();

   showToast(message:string, type: 'success' | 'error' | 'warning', duration:number=3000) {

    const id=Date.now()
    const newToast:ToastMessage={
      id,
      message,
      type
    }

    const currentToasts = this.toastSubject.value;
    this.toastSubject.next([...currentToasts, newToast]);

    setTimeout(()=>{
      this.removeToast(id);
    },duration)

  }

  removeToast(id:any){
    const currentToasts = this.toastSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastSubject.next(updatedToasts);
  }


}
