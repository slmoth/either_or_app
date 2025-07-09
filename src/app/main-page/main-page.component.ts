import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { VoteService } from '../vote.service';
import { catchError, switchMap } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  providers: [VoteService]
})
export class MainPageComponent implements OnInit{

  private voteService = inject(VoteService);

  question?: string = 'Who is the bigger noob?';
  either: string = 'Rooban';
  or: string = 'Joker';
  canVoteToday: boolean = true;
  eitherVoteCount: number = 0;
  orVoteCount: number = 0;
  pollingInterval = 5000; //ms

  constructor() {}

  ngOnInit(): void {
    //check to see if this person has voted today
    this.canVoteToday = this.canVote();
    //get vote counts
    this.getVoteCounts();
  }

  countVote($event: 'either' | 'or'): void {
    //check the sender and increment the appropriate count
    if (!this.canVoteToday){
      alert('Sorry, you already voted today');
      return;
    }

    this.voteService.addVote($event).subscribe((res: VoteCounts) => {
        if (res) {
          this.setVotedStatus();
          this.updateVoteCounts(res);
        } else {
          alert('There was an error processing your vote. Please try again');
        }
    });
    
  }

  updateVoteCounts(counts: VoteCounts): void {
    this.eitherVoteCount = counts.either;
    this.orVoteCount = counts.or;
  }

  setVotedStatus(): void {
    const today = new Date().toDateString();
    localStorage.setItem('lastEitherOrVoteDate', today);
    this.canVoteToday = false;
  }

  canVote(): boolean {
    const lastVoteDate = localStorage.getItem('lastEitherOrVoteDate');
    const today  = new Date().toDateString();
    const didVoteToday = lastVoteDate != today;
    return didVoteToday;
  }

  getVoteCounts(): void {
    this.startVoteCountPolling();
  }

  startVoteCountPolling(): void {
    interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.voteService.getVoteCounts())
      )
      .subscribe(votes => {
        this.eitherVoteCount = votes.either;
        this.orVoteCount = votes.or;
      });    
  }

}

export class VoteCounts {
  either: number = 0;
  or: number = 0;
}
