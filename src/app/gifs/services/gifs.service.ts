import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey = 'SiYhBlNfND2HCDpKhFj7TQ0SDQVzb5mp';
  private urlService: string = 'https://api.giphy.com/v1/gifs';

  private _history: string[] = [];

  public results: Gif[] = [];

  get history() {
    return [...this._history];
  }

  constructor(
    private http: HttpClient
  ) {

    this.results = JSON.parse( localStorage.getItem('results')! ) || [];

    //this._history = JSON.parse( localStorage.getItem('history')! ) || [];
    if ( localStorage.getItem('history') ) {
      this._history = JSON.parse( localStorage.getItem('history')! );
    }

  }

  searchGifs( query: string = '' ) {

    query = query.trim().toLowerCase();

    if (!this._history.includes( query )) {
      this._history.unshift( query );
      this._history = this._history.splice(0, 10);

      localStorage.setItem('history', JSON.stringify(this._history) );
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query );

    this.http.get<SearchGifsResponse>( `${ this.urlService }/search`, { params })
      .subscribe( ( resp ) => {
        console.log( resp.data );
        this.results = resp.data;
        localStorage.setItem('results', JSON.stringify(this.results) );
      })
  }

}
