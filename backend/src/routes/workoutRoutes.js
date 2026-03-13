const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');


router.use(protect); //All routes below require authentication

//create workout
router.post('/',workoutController.createWorkout) //
router.get('/',workoutController.getWorkouts) //get all workouts 

router.get('/:id', workoutController.getWorkout);         // GET /api/workouts/:id
router.put('/:id', workoutController.updateWorkout);      // PUT /api/workouts/:id
router.delete('/:id', workoutController.deleteWorkout);   // DELETE /api/workouts/:id


module.exports=router
