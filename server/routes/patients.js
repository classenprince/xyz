const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Joi = require('joi');

// Validation schemas
const doshaSchema = Joi.object({
  vata: Joi.number().min(0).max(5).required(),
  pitta: Joi.number().min(0).max(5).required(),
  kapha: Joi.number().min(0).max(5).required()
});

const patientValidationSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  age: Joi.number().min(0).max(150).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  
  contactInfo: Joi.object({
    phone: Joi.string().pattern(/^[\+]?[0-9]{6,15}$/).allow(''),
    email: Joi.string().email().lowercase().allow(''),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      state: Joi.string().allow(''),
      zipCode: Joi.string().allow(''),
      country: Joi.string().default('India')
    }).allow(null)
  }).allow(null),

  prakriti: doshaSchema.required(),
  vikriti: doshaSchema.required(),

  roga: Joi.array().items(Joi.object({
    condition: Joi.string().required(),
    severity: Joi.string().valid('Mild', 'Moderate', 'Severe').default('Moderate'),
    duration: Joi.string().allow(''),
    notes: Joi.string().allow('')
  })).default([]),

  physicalMeasurements: Joi.object({
    weight: Joi.object({
      value: Joi.number().required(),
      unit: Joi.string().valid('kg', 'lbs').default('kg')
    }).required(),
    height: Joi.object({
      feet: Joi.number(),
      inches: Joi.number(),
      cm: Joi.number()
    }).required()
  }).required(),

  dietaryHabits: Joi.object({
    type: Joi.string().valid('Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian').required(),
    appetite: Joi.string().valid('Poor', 'Moderate', 'Good', 'Excessive').default('Moderate'),
    foodPreferences: Joi.object({
      temperature: Joi.string().valid('Cold', 'Warm', 'Hot', 'Room Temperature').default('Warm'),
      taste: Joi.array().items(Joi.string().valid('Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent')),
      spiceLevel: Joi.string().valid('Mild', 'Medium', 'Spicy', 'Very Spicy').default('Medium')
    }),
    mealFrequency: Joi.object({
      mainMeals: Joi.number().min(1).max(6).default(3),
      snacks: Joi.number().min(0).max(5).default(1)
    }),
    targetCalories: Joi.number().min(800).max(5000).required(),
    allergies: Joi.array().items(Joi.string()),
    dislikes: Joi.array().items(Joi.string())
  }).required(),

  lifestyle: Joi.object({
    activityLevel: Joi.string().valid('Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active').default('Moderately Active'),
    sleepPattern: Joi.object({
      averageHours: Joi.number().min(3).max(12).default(7),
      quality: Joi.string().valid('Poor', 'Fair', 'Good', 'Excellent').default('Good')
    }),
    stressLevel: Joi.string().valid('Low', 'Moderate', 'High', 'Very High').default('Moderate'),
    occupation: Joi.string().allow(''),
    smokingStatus: Joi.string().valid('Never', 'Former', 'Current').default('Never'),
    alcoholConsumption: Joi.string().valid('None', 'Occasional', 'Moderate', 'Heavy').default('None')
  }).default({
    activityLevel: 'Moderately Active',
    sleepPattern: { averageHours: 7, quality: 'Good' },
    stressLevel: 'Moderate',
    occupation: '',
    smokingStatus: 'Never',
    alcoholConsumption: 'None'
  }),

  environment: Joi.object({
    climate: Joi.string().valid('Tropical', 'Subtropical', 'Temperate', 'Cold', 'Arid', 'Humid').default('Tropical'),
    season: Joi.string().valid('Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter').default('Summer')
  }).default({
    climate: 'Tropical',
    season: 'Summer'
  }),

  medicalHistory: Joi.object({
    currentMedications: Joi.array().items(Joi.object({
      name: Joi.string(),
      dosage: Joi.string(),
      frequency: Joi.string(),
      startDate: Joi.date()
    })),
    pastIllnesses: Joi.array().items(Joi.object({
      condition: Joi.string(),
      year: Joi.number(),
      treatment: Joi.string()
    })),
    familyHistory: Joi.array().items(Joi.object({
      relation: Joi.string(),
      condition: Joi.string()
    })),
    surgeries: Joi.array().items(Joi.object({
      procedure: Joi.string(),
      date: Joi.date(),
      hospital: Joi.string()
    }))
  }),

  createdBy: Joi.string().required() // ObjectId as string
});

// @route   GET /api/patients
// @desc    Get all patients
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { 'contactInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'createdBy', select: 'name email' },
        { path: 'dietPlans.planId', select: 'name description' }
      ]
    };

    const patients = await Patient.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalPatients = await Patient.countDocuments(query);
    
    const totalPages = Math.ceil(totalPatients / parseInt(limit));
    const currentPage = parseInt(page);
    
    res.json({
      success: true,
      data: patients,
      pagination: {
        currentPage: currentPage,
        totalPages: totalPages,
        totalPatients: totalPatients,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Public (should be protected in production)
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
});

// @route   POST /api/patients
// @desc    Create new patient
// @access  Public (should be protected in production)
router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('Request body type:', typeof req.body);
    console.log('Request body keys:', Object.keys(req.body || {}));
    
    // Validate request body
    const { error, value } = patientValidationSchema.validate(req.body, { 
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    // Check if patient with same email or phone already exists
    const existingPatient = await Patient.findOne({
      $or: [
        { 'contactInfo.email': value.contactInfo?.email },
        { 'contactInfo.phone': value.contactInfo?.phone }
      ],
      isActive: true
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this email or phone already exists'
      });
    }

    const patient = new Patient(value);
    const savedPatient = await patient.save();

    // Return the created patient
    const populatedPatient = savedPatient;

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: populatedPatient
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient (supports partial updates)
// @access  Public (should be protected in production)
router.put('/:id', async (req, res) => {
  try {
    // For patient details editor, allow partial updates
    const allowPartialUpdate = req.headers['x-partial-update'] === 'true';
    
    if (allowPartialUpdate) {
      // Direct update without full validation for editor
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { 
          ...req.body, 
          lastUpdated: new Date(),
          updatedAt: new Date()
        },
        { new: true, runValidators: false }
      );

      if (!patient || !patient.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Patient updated successfully',
        data: patient
      });
      return;
    }

    // Full validation for complete updates
    const { error, value } = patientValidationSchema.validate(req.body, { 
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...value, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Soft delete patient (set isActive to false)
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false, lastUpdated: new Date() },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting patient:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      error: error.message
    });
  }
});

// @route   GET /api/patients/:id/summary
// @desc    Get patient summary with key health metrics
// @access  Public (should be protected in production)
router.get('/:id/summary', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const summary = {
      basicInfo: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        bmi: patient.calculatedBMI
      },
      constitution: {
        dominantPrakriti: patient.dominantPrakriti,
        dominantVikriti: patient.dominantVikriti,
        prakritiBalnce: patient.prakriti,
        vikritiBalnce: patient.vikriti
      },
      currentHealth: {
        conditions: patient.roga.map(r => r.condition),
        targetCalories: patient.dietaryHabits.targetCalories,
        dietType: patient.dietaryHabits.type,
        activityLevel: patient.lifestyle?.activityLevel
      },
      lastUpdated: patient.lastUpdated
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching patient summary:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching patient summary',
      error: error.message
    });
  }
});

module.exports = router;
