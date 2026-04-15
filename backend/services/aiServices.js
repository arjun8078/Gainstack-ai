const { GoogleGenAI } = require("@google/genai");
const Workout = require('../src/models/Workout');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Helper function to calculate when quota resets
const getQuotaResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0); // Next midnight UTC
  
  const hoursUntilReset = Math.floor((tomorrow - now) / (1000 * 60 * 60));
  const minutesUntilReset = Math.floor(((tomorrow - now) % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    resetTime: tomorrow.toISOString(),
    hoursUntilReset,
    minutesUntilReset,
    resetTimeLocal: tomorrow.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    resetTimeUTC: tomorrow.toISOString().split('T')[0] + ' 00:00 UTC'
  };
};

// Generate fitness advice with RAG
exports.getFitnessAdice = async (userId, question) => {
  let modelUsed = "unknown";
  
  try {
    // Retrieve user's workout history
    const workouts = await Workout.find({ userId })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    // Build context
    let context = 'User Workout History:\n';

    if (workouts.length === 0) {
      context += 'No workout history available.\n';
    } else {
      workouts.forEach((workout, index) => {
        const date = new Date(workout.date).toLocaleDateString();
        const exercises = workout.exercises.map(ex => {
          const totalSets = ex.sets.length;
          const totalReps = ex.sets.reduce((sum, set) => sum + set.reps, 0);
          const totalVolume = ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
          return `${ex.name} (${totalSets} sets, ${totalReps} total reps, ${totalVolume}kg volume)`;
        }).join(', ');
        
        context += `${index + 1}. ${date}: ${exercises}. Total volume: ${workout.totalVolume}kg\n`;
      });
    }

    // Build prompt
    const prompt = `
You are a professional fitness coach and personal trainer. You have access to the user's workout history.

${context}

Based on the above workout history, please answer this question from the user:
"${question}"

Provide personalized, data-driven advice. Reference specific workouts when relevant. Be encouraging and constructive.
If the user has no workout history, give general advice and encourage them to start tracking.

Keep your response concise (2-3 paragraphs maximum).
`;

    // Retry helper
    const generateWithRetry = async (payload, retries = 2) => {
      try {
        return await ai.models.generateContent(payload);
      } catch (err) {
        if (retries > 0 && err.status === 503) {
          await new Promise(res => setTimeout(res, 2000));
          return generateWithRetry(payload, retries - 1);
        }
        throw err;
      }
    };

    // Try models in order
    const models = [
      "gemini-2.0-flash-exp",
      "gemini-exp-1206",
      "gemini-2.5-flash",
    ];

    let result = null;
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`🤖 Trying model: ${model}`);
        modelUsed = model;
        
        result = await generateWithRetry({
          model: model,
          contents: prompt
        });
        
        console.log(`✅ Success with ${model}`);
        break;
        
      } catch (err) {
        console.error(`❌ ${model} failed:`, err.message);
        lastError = err;
        
        if (err.status === 429 || err.status === 404 || err.status === 503) {
          continue;
        }
        throw err;
      }
    }

    if (!result) {
      throw lastError || new Error('All AI models unavailable');
    }

    const text = result.text;
    
    return {
      question,
      answer: text,
      workoutsAnalyzed: workouts.length,
      modelUsed: modelUsed
    };
    
  } catch (error) {
    console.error('❌ AI service error:', error);
    
    // If quota exceeded, include reset time
    if (error.status === 429) {
      const resetInfo = getQuotaResetTime();
      
      const quotaError = new Error('QUOTA_EXCEEDED');
      quotaError.resetInfo = resetInfo;
      quotaError.status = 429;
      throw quotaError;
    }
    
    throw error;
  }
};