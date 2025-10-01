const express = require('express');
const DietPlanGeneratorService = require('../services/dietPlanGenerator');
const Patient = require('../models/Patient');
const router = express.Router();

// Initialize diet plan generator service
const dietPlanGenerator = new DietPlanGeneratorService();

/**
 * @route   POST /api/diet-plans/generate/:patientId
 * @desc    Generate personalized diet plan for a patient using OpenAI
 * @access  Public
 */
router.post('/generate/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate patient ID
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Diet plan generation service not configured. Please set OPENAI_API_KEY.'
      });
    }

    // Fetch patient data from database
    const patient = await Patient.findById(patientId);
    
    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    console.log(`Generating diet plan for patient: ${patient.name} (${patientId})`);

    // Generate diet plan using OpenAI
    const result = await dietPlanGenerator.generateDietPlan(patient);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Diet plan generated successfully',
        data: result.data,
        meta: {
          patientId: patientId,
          patientName: patient.name,
          tokensUsed: result.tokensUsed,
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate diet plan',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Diet plan generation error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during diet plan generation',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/diet-plans/generate-direct
 * @desc    Generate diet plan with patient data provided directly (for testing)
 * @access  Public
 */
router.post('/generate-direct', async (req, res) => {
  try {
    console.log('🔥 DIRECT DIET PLAN GENERATION REQUEST RECEIVED');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const { patientData } = req.body;

    if (!patientData) {
      console.log('❌ No patient data provided');
      return res.status(400).json({
        success: false,
        message: 'Patient data is required'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Diet plan generation service not configured. Please set OPENAI_API_KEY.'
      });
    }

    // If patient has _id, fetch full data from MongoDB for complete context
    let fullPatientData = patientData;
    if (patientData._id) {
      console.log('🔍 Patient ID found, fetching complete data from MongoDB:', patientData._id);
      try {
        const patient = await Patient.findById(patientData._id);
        if (patient) {
          fullPatientData = patient.toObject();
          console.log('✅ Full patient data fetched from MongoDB:', {
            name: fullPatientData.name,
            age: fullPatientData.age,
            prakriti: fullPatientData.prakriti,
            vikriti: fullPatientData.vikriti,
            roga: fullPatientData.roga,
            dietaryHabits: fullPatientData.dietaryHabits
          });
        } else {
          console.warn('⚠️ Patient not found in MongoDB, using provided data');
        }
      } catch (dbError) {
        console.error('❌ Error fetching from MongoDB:', dbError);
        console.log('🔄 Continuing with provided patient data');
      }
    }
    
    console.log('✅ Using patient data for generation:', {
      hasId: !!fullPatientData._id,
      name: fullPatientData.name,
      age: fullPatientData.age,
      gender: fullPatientData.gender,
      prakriti: fullPatientData.prakriti,
      vikriti: fullPatientData.vikriti,
      roga: fullPatientData.roga,
      dietaryHabits: fullPatientData.dietaryHabits?.type
    });

    console.log(`🤖 Generating personalized diet plan for: ${fullPatientData.name}`);

    // Generate diet plan using OpenAI with complete patient data
    const result = await dietPlanGenerator.generateDietPlan(fullPatientData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Diet plan generated successfully',
        data: result.data,
        meta: {
          patientId: fullPatientData._id,
          patientName: fullPatientData.name,
          dataSource: fullPatientData._id ? 'MongoDB + Frontend' : 'Frontend Only',
          tokensUsed: result.tokensUsed,
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate diet plan',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Diet plan generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during diet plan generation',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/diet-plans/test/:patientId
 * @desc    Test diet plan generation with detailed logging
 * @access  Public
 */
router.get('/test/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log('=== DIET PLAN GENERATION TEST ===');
    console.log('Patient ID:', patientId);
    console.log('OpenAI API Key configured:', !!process.env.OPENAI_API_KEY);
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.',
        debug: {
          patientId,
          apiKeyConfigured: false
        }
      });
    }

    // Fetch patient data
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        debug: { patientId }
      });
    }

    console.log('Patient found:', patient.name);
    console.log('Patient data preview:', {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      prakriti: patient.prakriti,
      vikriti: patient.vikriti
    });

    // Test the diet plan generation
    const result = await dietPlanGenerator.generateDietPlan(patient);
    
    console.log('Generation result:', result.success ? 'SUCCESS' : 'FAILED');
    if (!result.success) {
      console.log('Error:', result.error);
    }

    res.json({
      success: true,
      message: 'Diet plan generation test completed',
      debug: {
        patientId,
        patientName: patient.name,
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        generationSuccess: result.success,
        error: result.error || null,
        tokensUsed: result.tokensUsed || 0
      },
      result: result
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message,
      debug: {
        patientId: req.params.patientId,
        apiKeyConfigured: !!process.env.OPENAI_API_KEY
      }
    });
  }
});

/**
 * @route   GET /api/diet-plans/health
 * @desc    Check diet plan generation service health
 * @access  Public
 */
router.get('/health', (req, res) => {
  const isConfigured = !!process.env.OPENAI_API_KEY;
  
  res.status(200).json({
    success: true,
    message: 'Diet plan generation service status',
    status: {
      configured: isConfigured,
      service: 'OpenAI GPT-4o-mini',
      features: [
        'Personalized Ayurvedic diet plans',
        'Dosha-based meal recommendations',
        'Calorie and macro calculations',
        'Herb and lifestyle recommendations'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
