import {Exercise} from './exercise.model';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exercisesChange = new Subject<Exercise[]>();
  finishedExercisesChange = new Subject<Exercise[]>();
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService, private store: Store<fromTraining.State>) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db.collection('availableExercises')
      .snapshotChanges()
      .pipe(map(
        docArray => {
          // throw(new Error());
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              // @ts-ignore
              name: doc.payload.doc.data().name,
              // @ts-ignore
              duration: doc.payload.doc.data().duration,
              // @ts-ignore
              calories: doc.payload.doc.data().calories
            };
          });
        }
      ))
      .subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableExercises(exercises));
      }, () => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching exercises failed. Please, try again later', null, 3000);
        this.exercisesChange.next(null);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartExercise(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
    });
    this.store.dispatch(new Training.StopExercise());
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'canceled'
      });
    });
    this.store.dispatch(new Training.StopExercise());
  }

  fetchFinishedExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedExercises(exercises));
      }));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}

