import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { SweetAlertService } from './sweet-alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class RequesterService {

  constructor(
    private httpClient: HttpClient,
    private ActivatedRoute : ActivatedRoute,
    private SweetAlertService : SweetAlertService,
    private router: Router,
    private NgxSpinnerService : NgxSpinnerService,
    private ConfigurationService : ConfigurationService
  ) { }

  RouteBaseApi : string="http://127.0.0.1:8000/api/" //this.ConfigurationService.config()

  isproduction : boolean=!window.location.href.includes('localhost')

  handleError(route: ActivatedRouteSnapshot, errorResponse: HttpErrorResponse) {
    this.hidespinner(0)
    var title= errorResponse.name+' '+errorResponse.status+' '+errorResponse.statusText
    var text = errorResponse.error==undefined ? errorResponse.message :errorResponse.error.message+'\n'+errorResponse.url
    switch (errorResponse.status) {
      case 404: {
        // this.router.navigate(['/not-found']);
        this.SweetAlertService.ShowErrorMessage(title,text)
        return of(null);
      }
      case 401: {
        const returnURL: string = '/' + route.url.map(segment => segment.path).join('/');
        this.router.navigate(['/login'], { queryParams: { returnURL: returnURL }});
        this.SweetAlertService.ShowErrorMessage(title,text)
        return of(null);
      }
      case 403: {
        this.router.navigate(['/unauthorized']);
        this.SweetAlertService.ShowErrorMessage(title,text)
        return of(null);
      }
      default: {
        this.SweetAlertService.ShowErrorMessage(title,text)
        // this.router.navigate(['/error']);
        return of(null);
      }
    }
  }

  hidespinner(timeout : number=1000)
  {
    // console.log('Timeout '+timeout)
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.NgxSpinnerService.hide();
    }, timeout);
  }



  private async Get(target : string,headers : HttpHeaders= new HttpHeaders())
  {

    var LinkApi : string=""

    target.includes('http') ? LinkApi = target : LinkApi=this.RouteBaseApi+target

    return this.httpClient
    .get<any[]>(LinkApi,{headers : headers})
    .pipe(
      map((response: any) =>  response),
      catchError(errorResponse => this.handleError(this.ActivatedRoute.snapshot, errorResponse),
      )
    )

  }

  private async Post(target : string, data : object,headers : HttpHeaders= new HttpHeaders())
    {

      var LinkApi : string=""
      // LinkApi=this.RouteBaseApi+target

      target.includes('http') ? LinkApi = target : LinkApi=this.RouteBaseApi+target

      return this.httpClient
      .post(LinkApi,data,{headers : headers})
      .pipe(
        map(response => response),
        catchError(errorResponse => this.handleError(this.ActivatedRoute.snapshot, errorResponse),
        )
      )

    }

  private async GetImage(target : string)
  {
    return this.httpClient
    .get<Blob>(this.RouteBaseApi+target,{responseType: 'blob' as 'json'})
    .pipe(
      map(response =>  response),
      catchError(errorResponse => this.handleError(this.ActivatedRoute.snapshot, errorResponse),
      )
    )

  }


  async AsyncGetResponseWithoutParams(targetapi : string)
  {
    var ReturnedResponse : any=[]
    var LinkToDisplay = targetapi
    // targetapi = EnumEndPoint.GetElementWihtoutParameter+targetapi
    ReturnedResponse=await this.Subscriber(await this.Get(targetapi),LinkToDisplay)

    return ReturnedResponse;
  }

  async AsyncGetResponseWithParams(targetapi : string)
  {
    // targetapi = EnumEndPoint.GetElementWihParameter+targetapi
    await this.Subscriber(await this.Get(targetapi),targetapi)
  }

  async AsyncGetResponse(targetapi : string,headers : HttpHeaders= new HttpHeaders())
  {
    var ReturnedResponse : any=[]
    ReturnedResponse=await this.Subscriber(await this.Get(targetapi,headers),targetapi)
    return ReturnedResponse;
  }


  async AsyncPostResponse<T>(
    route: string,
    data: any,
    isFormData: boolean,
    isAuth: boolean,
    isFile: boolean
  ): Promise<T> {
    const response = await this.Subscriber(await this.Post(route, data), route);
    return response as T;
  }

  ShowConsolelog()
    {
      return window.location.href.includes('localhost')
    }



  private async Subscriber(Observable : Observable<any>,target: string)
  {
    var ImageResponse : any=null
    var isOkExternalApi : number=1
    var ReturnedResponse : any=[]
    // Observable.toPromise()
    await firstValueFrom(Observable).then(
      (response : any) => {

        if(response!=null)
        {
          typeof ReturnedResponse!="object" ? ReturnedResponse.push(response) : ReturnedResponse=response;
          if(target.includes('GetImage'))
          {
            ImageResponse = response;
          }

        }
        else
        {
          ReturnedResponse=[null]
        }


      }
    ).catch(
      (error) =>
      {
        console.log("Promise rejected with error")
        console.log(error)
      }
    )

    this.Showlog('ReturnedResponse',ReturnedResponse)
    return ReturnedResponse;

  }

  Showlog(message : string,data:any=null)
  {
    if(this.isproduction ? true : false)
    {
      if(data==null)
      {
        console.log(message)
      }
      else
      {
        console.log(message,data)
      }
    }

  }



}
