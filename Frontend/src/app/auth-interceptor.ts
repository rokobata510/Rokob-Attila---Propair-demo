import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('auth_token');
  const authReq = req.clone({
    setHeaders: { Authorization: `x-auth-token ${authToken}` }
  });
  return next(authReq);
};