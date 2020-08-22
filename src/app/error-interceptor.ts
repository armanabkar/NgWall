import { ErrorComponent } from './error/error.component';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse): any => {
        let errorMessage = 'An unknown error occurred.';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        return throwError(error);
      })
    );
  }
}
