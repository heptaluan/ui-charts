/*
 * @Description: http服务
 */
import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { catchError, map } from 'rxjs/operators'
import { API } from '../api.service'
import { ToastrService } from 'ngx-toastr'

export interface CommonResponse<T> {
  message: string
  resultCode: number
  data?: T
}

@Injectable()
export class HttpService {
  code: number

  constructor(private _http: HttpClient, private _router: Router, private _api: API, private toastr: ToastrService) {}

  createAuthorizationHeader(header: Headers) {}

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 400:
            break
          case 401:
            break
          case 500:
            break
          case 404:
            break
          default:
            this.toastr.error(null, '网络不稳定，编辑内容可能无法被保存')
            break
        }
      } else if (error.resultCode) {
        switch (error.resultCode) {
          case 2007:
            console.log(2007)
            console.log(`登录失效`)
            if (window.location.href.indexOf('workspace') > 0) {
              this.toastr.error(null, '当前未登录，编辑内容可能无法被保存')
            }
            this.code = 2007
            break
          case 3001:
            console.log(3001)
            console.log(`登录失效`)
            if (window.location.href.indexOf('workspace') > 0) {
              this.toastr.error(null, '当前未登录，编辑内容可能无法被保存')
            }
          default:
            console.log(error.message)
            break
        }
      }
      throw error
    }
  }

  get<T>(url: string, httpOptions?: Object): Observable<any> {
    return this._http.get<CommonResponse<T>>(url, httpOptions).pipe(
      map((rep: CommonResponse<T>) => {
        if (rep.resultCode === 1000) {
          return rep.data
        } else {
          throw rep
        }
      }),
      catchError(this.handleError<T>())
    )
  }

  post<T>(url: string, data: any, httpOptions?: Object): Observable<any> {
    return this._http.post<CommonResponse<T>>(url, data, httpOptions).pipe(
      map((rep) => {
        if (rep.resultCode === 1000) {
          return rep
        } else {
          throw rep
        }
      }),
      catchError(this.handleError())
    )
  }

  delete<T>(url: string, data: any, httpOptions?: Object): Observable<any> {
    return this._http.delete<CommonResponse<T>>(url, httpOptions).pipe(
      map((rep) => {
        if (rep.resultCode === 1000) {
          return rep
        } else {
          throw rep
        }
      }),
      catchError(this.handleError())
    )
  }

  put<T>(url: string, data: any, httpOptions?: Object): Observable<any> {
    return this._http.put<CommonResponse<T>>(url, data, httpOptions).pipe(
      map((rep: CommonResponse<T>) => {
        if (rep.resultCode === 1000) {
          return rep
        } else {
          throw rep
        }
      }),
      catchError(this.handleError())
    )
  }

  patch<T>(url: string, body: any, httpOptions?: Object): Observable<any> {
    return this._http.patch(url, body, httpOptions).pipe(catchError(this.handleError()))
  }
}
