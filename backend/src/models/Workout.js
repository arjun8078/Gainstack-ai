const mongoose = require('mongoose');

// Set schema (nested in exercise)
// Note: setNumber explicitly stored for clarity when reading/debugging data
//       Validated with min: 1 since sets start from 1, not 0
const setSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: [true, 'Set number is required'],
    min: [1, 'Set number must be at least 1']  // Sets numbered 1, 2, 3...
  },
  reps: {
    type: Number,
    required: [true, 'Reps are required'],
    min: [1, 'Reps must be at least 1']  // Can't do 0 reps!
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative']  // 0 is valid (bodyweight)
  },
  restTime: {
    type: Number,  // seconds
    default: 0,
    min: [0, 'Rest time cannot be negative']
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { _id: false });  // Don't create _id for each set (sets accessed by array index)

// Exercise schema (nested in workout)
const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required:false,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'],
    default: 'Other'
  },
  sets: {
    type: [setSchema],
    validate: {
      validator: function(sets) {
        return sets && sets.length > 0;
      },
      message: 'Exercise must have at least one set'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, { _id: false });  // Don't create _id for exercises (accessed by array index)

// Main Workout schema
const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true  // Index for fast queries by user
  },
  date: {
    type: Date,
    required: [true, 'Workout date is required'],
    index: true  // Index for date-based queries
  },
  exercises: {
    type: [exerciseSchema],
    validate: {
      validator: function(exercises) {
        return exercises && exercises.length > 0;
      },
      message: 'Workout must have at least one exercise'
    }
  },
  totalDuration: {
    type: Number,  // Total workout time in seconds
    min: [0, 'Duration cannot be negative'],
    default: 0
  },
  totalVolume: {
    type: Number,  // Auto-calculated: sum of (weight × reps)
    default: 0,
    min: [0, 'Volume cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Compound index for efficient queries (get user's workouts sorted by date)
workoutSchema.index({ userId: 1, date: -1 });

// Virtual for workout summary (computed, not stored)
workoutSchema.virtual('summary').get(function() {
  return {
    totalExercises: this.exercises.length,
    totalSets: this.exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
    totalVolume: this.totalVolume,
    duration: this.totalDuration
  };
});

// Pre-save hook: Automatically calculate total volume before saving
// CORRECT:
workoutSchema.pre('save', async function() {  // ← Remove 'next' parameter, add 'async'
  let totalVolume = 0;
  
  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      totalVolume += (set.weight * set.reps);
    });
  });
  
  this.totalVolume = totalVolume;
  // No next() needed with async!
});

// Instance method: Get detailed workout statistics
workoutSchema.methods.getStats = function() {
  const stats = {
    date: this.date,
    exerciseCount: this.exercises.length,
    totalSets: 0,
    totalReps: 0,
    totalVolume: this.totalVolume,
    duration: this.totalDuration,
    exerciseBreakdown: []
  };

  this.exercises.forEach(exercise => {
    const exerciseStats = {
      name: exercise.name,
      category: exercise.category,
      sets: exercise.sets.length,
      totalReps: 0,
      volume: 0
    };

    exercise.sets.forEach(set => {
      exerciseStats.totalReps += set.reps;
      exerciseStats.volume += (set.weight * set.reps);
      stats.totalSets++;
      stats.totalReps += set.reps;
    });

    stats.exerciseBreakdown.push(exerciseStats);
  });

  return stats;
};

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;