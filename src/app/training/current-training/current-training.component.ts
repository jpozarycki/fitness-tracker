import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StopTrainingComponent} from './stop-training.component';
import {TrainingService} from '../training.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingExit = new EventEmitter<void>();
  progress = 0;
  timer: number;
  exercise$ = new Subscription();

  constructor(private dialog: MatDialog, private trainingService: TrainingService, private store: Store<fromTraining.State>) {
  }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  private startOrResumeTimer() {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(exercise => {
      const step = exercise.duration / 100 * 1000;
      this.timer = setInterval(() => {
        this.progress = this.progress + 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.exercise$.unsubscribe();
  }
}
