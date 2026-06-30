export type ExerciseCategory =
  | 'Squat'
  | 'Hinge'
  | 'Push'
  | 'Pull'
  | 'Core'
  | 'Cardio'
  | 'Mobility'
  | 'Isolation';

export interface CatalogExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  defaultSets: number;
  defaultReps: string;
  defaultRest: string;
}

export const EXERCISE_CATALOG: CatalogExercise[] = [
  // Squat
  { id: 'cat-back-squat', name: 'Back squat', category: 'Squat', defaultSets: 4, defaultReps: '5', defaultRest: '120s' },
  { id: 'cat-front-squat', name: 'Front squat', category: 'Squat', defaultSets: 4, defaultReps: '6', defaultRest: '90s' },
  { id: 'cat-goblet-squat', name: 'Goblet squat', category: 'Squat', defaultSets: 3, defaultReps: '12', defaultRest: '60s' },
  { id: 'cat-leg-press', name: 'Leg press', category: 'Squat', defaultSets: 3, defaultReps: '10', defaultRest: '90s' },
  { id: 'cat-bulgarian-split', name: 'Bulgarian split squat', category: 'Squat', defaultSets: 3, defaultReps: '10/leg', defaultRest: '60s' },
  { id: 'cat-walking-lunges', name: 'Walking lunges', category: 'Squat', defaultSets: 3, defaultReps: '12/leg', defaultRest: '45s' },
  { id: 'cat-hack-squat', name: 'Hack squat', category: 'Squat', defaultSets: 3, defaultReps: '10', defaultRest: '90s' },

  // Hinge
  { id: 'cat-rdl', name: 'Romanian deadlift', category: 'Hinge', defaultSets: 3, defaultReps: '8', defaultRest: '90s' },
  { id: 'cat-deadlift', name: 'Conventional deadlift', category: 'Hinge', defaultSets: 4, defaultReps: '5', defaultRest: '180s' },
  { id: 'cat-sumo-deadlift', name: 'Sumo deadlift', category: 'Hinge', defaultSets: 4, defaultReps: '5', defaultRest: '180s' },
  { id: 'cat-hip-thrust', name: 'Hip thrust', category: 'Hinge', defaultSets: 3, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-good-morning', name: 'Good morning', category: 'Hinge', defaultSets: 3, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-glute-bridge', name: 'Glute bridge', category: 'Hinge', defaultSets: 3, defaultReps: '15', defaultRest: '45s' },
  { id: 'cat-kb-swing', name: 'Kettlebell swing', category: 'Hinge', defaultSets: 4, defaultReps: '15', defaultRest: '45s' },

  // Push
  { id: 'cat-bench-press', name: 'Bench press', category: 'Push', defaultSets: 4, defaultReps: '5', defaultRest: '120s' },
  { id: 'cat-incline-db', name: 'Incline dumbbell press', category: 'Push', defaultSets: 4, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-ohp', name: 'Overhead press', category: 'Push', defaultSets: 3, defaultReps: '8', defaultRest: '90s' },
  { id: 'cat-db-shoulder-press', name: 'Dumbbell shoulder press', category: 'Push', defaultSets: 3, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-dips', name: 'Dips', category: 'Push', defaultSets: 3, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-push-ups', name: 'Push-ups', category: 'Push', defaultSets: 3, defaultReps: '15', defaultRest: '45s' },
  { id: 'cat-cable-fly', name: 'Cable fly', category: 'Push', defaultSets: 3, defaultReps: '12', defaultRest: '45s' },
  { id: 'cat-lateral-raise', name: 'Lateral raise', category: 'Push', defaultSets: 3, defaultReps: '15', defaultRest: '30s' },

  // Pull
  { id: 'cat-pull-up', name: 'Pull-up', category: 'Pull', defaultSets: 3, defaultReps: '8', defaultRest: '90s' },
  { id: 'cat-chin-up', name: 'Chin-up', category: 'Pull', defaultSets: 3, defaultReps: '8', defaultRest: '90s' },
  { id: 'cat-barbell-row', name: 'Barbell row', category: 'Pull', defaultSets: 4, defaultReps: '8', defaultRest: '90s' },
  { id: 'cat-db-row', name: 'Dumbbell row', category: 'Pull', defaultSets: 3, defaultReps: '10', defaultRest: '60s' },
  { id: 'cat-lat-pulldown', name: 'Lat pulldown', category: 'Pull', defaultSets: 3, defaultReps: '12', defaultRest: '60s' },
  { id: 'cat-seated-row', name: 'Seated cable row', category: 'Pull', defaultSets: 3, defaultReps: '12', defaultRest: '60s' },
  { id: 'cat-face-pull', name: 'Face pull', category: 'Pull', defaultSets: 3, defaultReps: '15', defaultRest: '30s' },
  { id: 'cat-bicep-curl', name: 'Bicep curl', category: 'Pull', defaultSets: 3, defaultReps: '12', defaultRest: '45s' },

  // Core
  { id: 'cat-plank', name: 'Plank', category: 'Core', defaultSets: 3, defaultReps: '45s', defaultRest: '30s' },
  { id: 'cat-deadbug', name: 'Dead bug', category: 'Core', defaultSets: 3, defaultReps: '10/side', defaultRest: '30s' },
  { id: 'cat-hanging-leg-raise', name: 'Hanging leg raise', category: 'Core', defaultSets: 3, defaultReps: '10', defaultRest: '45s' },
  { id: 'cat-ab-rollout', name: 'Ab rollout', category: 'Core', defaultSets: 3, defaultReps: '10', defaultRest: '45s' },
  { id: 'cat-pallof-press', name: 'Pallof press', category: 'Core', defaultSets: 3, defaultReps: '12/side', defaultRest: '30s' },
  { id: 'cat-russian-twist', name: 'Russian twist', category: 'Core', defaultSets: 3, defaultReps: '20', defaultRest: '30s' },

  // Cardio
  { id: 'cat-rowing', name: 'Rowing machine', category: 'Cardio', defaultSets: 1, defaultReps: '10 min', defaultRest: '—' },
  { id: 'cat-assault-bike', name: 'Assault bike', category: 'Cardio', defaultSets: 1, defaultReps: '10 min', defaultRest: '—' },
  { id: 'cat-treadmill-run', name: 'Treadmill run', category: 'Cardio', defaultSets: 1, defaultReps: '20 min', defaultRest: '—' },
  { id: 'cat-jump-rope', name: 'Jump rope', category: 'Cardio', defaultSets: 3, defaultReps: '60s', defaultRest: '30s' },
  { id: 'cat-burpees', name: 'Burpees', category: 'Cardio', defaultSets: 3, defaultReps: '10', defaultRest: '45s' },
  { id: 'cat-box-jump', name: 'Box jump', category: 'Cardio', defaultSets: 3, defaultReps: '8', defaultRest: '60s' },

  // Mobility
  { id: 'cat-foam-roll', name: 'Foam roll', category: 'Mobility', defaultSets: 1, defaultReps: '5 min', defaultRest: '—' },
  { id: 'cat-hip-90-90', name: 'Hip 90/90 stretch', category: 'Mobility', defaultSets: 2, defaultReps: '30s/side', defaultRest: '—' },
  { id: 'cat-world-greatest', name: 'World\'s greatest stretch', category: 'Mobility', defaultSets: 2, defaultReps: '5/side', defaultRest: '—' },
  { id: 'cat-cat-cow', name: 'Cat-cow', category: 'Mobility', defaultSets: 2, defaultReps: '10', defaultRest: '—' },
  { id: 'cat-band-pull-apart', name: 'Band pull-apart', category: 'Mobility', defaultSets: 3, defaultReps: '15', defaultRest: '—' },

  // Isolation
  { id: 'cat-tricep-pushdown', name: 'Tricep pushdown', category: 'Isolation', defaultSets: 3, defaultReps: '15', defaultRest: '30s' },
  { id: 'cat-hammer-curl', name: 'Hammer curl', category: 'Isolation', defaultSets: 3, defaultReps: '12', defaultRest: '45s' },
  { id: 'cat-leg-curl', name: 'Leg curl', category: 'Isolation', defaultSets: 3, defaultReps: '12', defaultRest: '45s' },
  { id: 'cat-leg-extension', name: 'Leg extension', category: 'Isolation', defaultSets: 3, defaultReps: '12', defaultRest: '45s' },
  { id: 'cat-calf-raise', name: 'Calf raise', category: 'Isolation', defaultSets: 3, defaultReps: '15', defaultRest: '30s' },
  { id: 'cat-rear-delt-fly', name: 'Rear delt fly', category: 'Isolation', defaultSets: 3, defaultReps: '15', defaultRest: '30s' },
];

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'Squat', 'Hinge', 'Push', 'Pull', 'Core', 'Cardio', 'Mobility', 'Isolation',
];
