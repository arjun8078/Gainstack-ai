const aiService = require('../../services/aiServices');

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

        const result=await aiService.getFitnessAdice(req.user._id,question)
         res.status(200).json({
            status: 'success',
            data: result
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