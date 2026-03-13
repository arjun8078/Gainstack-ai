const Workout=require('../models/Workout')

exports.createWorkout=async(req,res)=>{

 try {
       const { date, exercises, totalDuration, notes } = req.body;

       // Validate input
    if (!exercises || exercises.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Workout must have at least one exercise'
      });
    }

    const workout=await Workout.create({
         userId: req.user._id,  // From protect middleware
      date: date || new Date(),
      exercises,
      totalDuration: totalDuration || 0,
      notes
    })
    res.status(201).json({
      status: 'success',
      data: {
        workout
      }
    });
    
 } catch (error) {
    console.error('Create workout error:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error creating workout'
    });
 }

 
}

exports.getWorkouts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Optional date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);  //$gte = Greater Than or Equal (>=)
      if (endDate) query.date.$lte = new Date(endDate);         //$lte = Less Than or Equal (<=)
    }

    // Pagination
    // Page 1:
// skip = (1 - 1) * 10 = 0
// Skip 0 workouts, start from beginning
// Show workouts 1-10

// Page 2:
//skip = (2 - 1) * 10 = 10
// Skip first 10 workouts
// Show workouts 11-20
    const skip = (page - 1) * limit;  

    // Execute query
   // Workout.find(query)
// Find all workouts matching the query

//.sort({ date: -1 })
// Sort by date in descending order (newest first)
// -1 = descending (Z→A, 9→1, newest→oldest)
//  1 = ascending (A→Z, 1→9, oldest→newest)

//.limit(parseInt(limit))
// Only return this many results
// parseInt() converts "10" (string) to 10 (number)

//.skip(skip)
// Skip this many results (for pagination)
    const workouts = await Workout.find(query)
      .sort({ date: -1 })  // Newest first
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Workout.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: workouts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        workouts
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching workouts'
    });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Make sure workout belongs to logged-in user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this workout'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        workout,
        stats: workout.getStats()  // Include detailed stats
      }
    });
  } catch (error) {
    console.error('Get workout error:', error);
    
    // Invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error fetching workout'
    });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Make sure workout belongs to user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this workout'
      });
    }

    // Update fields
    const { date, exercises, totalDuration, notes } = req.body;
    
    if (date) workout.date = date;
    if (exercises) workout.exercises = exercises;
    if (totalDuration !== undefined) workout.totalDuration = totalDuration;
    if (notes !== undefined) workout.notes = notes;

    // Save (triggers pre-save hook to recalculate totalVolume)
    await workout.save();

    res.status(200).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Update workout error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error updating workout'
    });
  }
};
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Make sure workout belongs to user
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this workout'
      });
    }

    await workout.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting workout'
    });
  }
};
