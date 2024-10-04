import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private voteUrl = 'http://localhost:3000/votes';
  private http = inject(HttpClient);

  constructor() { }

  getVoteCounts(): Observable<any> {
    return this.http.get(this.voteUrl);
  }

  addVote(vote: 'either' | 'or'): Observable<any> {
    return this.http.post(this.voteUrl, { vote });
  }

}
