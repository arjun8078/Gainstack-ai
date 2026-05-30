const aiService = require('../../services/aiServices');
const redisService = require('../../services/redisService');

exports.askAI=async (req,res)=>{
    try {
        const {question}=req.body
        console.log('question: ', question);
        console.log('req.body: ', req.body);

        if(!question){
            return res.status(400).json({
                status:'error',
                message:'Please provide a question'
            })
        }

        const cacheKey=`ai_response:${req.user._id}:${question.toLowerCase().trim()}`;
        const cachedResponse=await redisService.get(cacheKey);

        if (cachedResponse) {
           console.log('Cache hit for key:', cacheKey);
            return res.status(200).json({
                status: 'success',
                data: cachedResponse,
                fromCache: true
            });
        }
        console.log('❌ Cache MISS - calling Gemini API');
       
          
        const result=await aiService.getFitnessAdice(req.user._id,question)
        await redisService.set(cacheKey, result, 3600);
        console.log('AI response is saved to cache');
         res.status(200).json({
            status: 'success',
            data: result,
            fromCache: false
    });
        


    } catch (error) {
        console.error('AI controller error:', error);
    
    // Handle quota exceeded with reset time
    if (error.message === 'QUOTA_EXCEEDED' && error.resetInfo) {
      return res.status(429).json({
        status: 'error',
        message: 'AI quota exceeded',
        quotaExceeded: true,
        resetInfo: error.resetInfo
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to get AI response'
    });
    }
}