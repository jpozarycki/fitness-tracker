import {Exercise} from './exercise.model';
import * as fromRoot from '../app.reducer';
import {SET_AVAILABLE_EXERCISES, SET_FINISHED_EXERCISES, START_EXERCISE, STOP_EXERCISE, TrainingActions} from './training.actions';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeExercise: null
};

export function authReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_EXERCISES:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_EXERCISES:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_EXERCISE:
      return {
        ...state,
        activeExercise: action
      };
    case STOP_EXERCISE:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export const getIsAuthenticated = (state: State) => state.isAuthenticated;
