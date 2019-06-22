import {Component, OnDestroy, OnInit} from '@angular/core';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exercises$ = new Subscription();
  loading$ = new Subscription();
  isLoading = false;

  constructor(private trainingService: TrainingService, private uiService: UiService) {
  }

  ngOnInit() {
    this.loading$ = this.uiService.loadingTrainingChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exercises$ = this.trainingService.exercisesChange.subscribe(exercises => {
      this.exercises = exercises;
    });
    this.fetchExercises();
  }


  onStartTraining(form: NgForm) {
    console.log(form.value.exercise);
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercises$.unsubscribe();
    this.loading$.unsubscribe();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
}
