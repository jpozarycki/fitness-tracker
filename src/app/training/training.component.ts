import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from './training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraining = false;
  exercise$ = new Subscription();

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exercise$ = this.trainingService.exerciseChange.subscribe(
      runningExercise => {
        console.log(runningExercise);
        if (runningExercise) {
          this.onGoingTraining = true;
        } else {
          this.onGoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.exercise$.unsubscribe();
  }

}
