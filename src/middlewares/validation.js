import Joi from "joi";
export const createBookingSchema = Joi.object({
  tourPackageId: Joi.string().hex().length(24).required(),

  tourSlotId: Joi.string().hex().length(24).required(),

  seatsBooked: Joi.number().integer().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  totalAmount: Joi.number().positive().required(),
});

export const createTourSlotSchema = Joi.object({
  tourPackageId: Joi.string().hex().length(24).required(),

  startDate: Joi.date().iso().required(),

  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),

  maxCapacity: Joi.number().integer().min(1).max(6).default(6),

  bookedSeats: Joi.number().integer().min(0).default(0),

  isActive: Joi.boolean().default(true),
});

export const createTourPackageSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),

  description: Joi.string().trim().allow("").optional(),

  images: Joi.array().items(Joi.string().uri()).min(1).required(),

  location: Joi.string().trim().required(),

  durationDays: Joi.number().integer().min(1).required(),

  pricePerSeat: Joi.number().positive().required(),

  maxCapacity: Joi.number().integer().min(1).default(6),
});

export const createJournalSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content cannot be empty",
    "any.required": "Content is required",
  }),

  mood: Joi.string()
    .valid("HAPPY", "NEUTRAL", "SAD", "ANXIOUS","OK","ANGRY","OTHER")
    .required()
    .messages({
      "any.only": "Mood must be one of HAPPY, NEUTRAL, SAD, ANXIOUS",
      "any.required": "Mood is required",
    }),
  tags: Joi.array()
    .items(
      Joi.string().valid(
        "Gratitude",
        "Stress",
        "Exercise",
        "Family",
        "Work",
        "Relaxing",
        "Relationships",
      ),
    )
    .default([])
    .messages({
      "array.includes":
        "Tags must be one of Gratitude, Stress, Exercise, Family, Work, Relaxing, Relationships",
    }),
});

export const updateJournalSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).optional(),
  mood: Joi.string().valid("HAPPY", "NEUTRAL", "SAD", "ANXIOUS").optional(),
}).min(1);

export const userUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters long",
  }),
  gender: Joi.string()
    .valid("Male", "Female", "Other", "Prefer not to say")
    .messages({
      "any.only": "Gender must be Male, Female, Other, or Prefer not to say",
    }),

  AlternateNumber: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .messages({
      "number.base": "Alternate number must be a number",
      "number.min": "Alternate number must be a valid 10-digit phone number",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validates email format
    .lowercase()
    .trim()
    .messages({
      "string.email": "Please provide a valid email address",
    }),

  avatar: Joi.string().uri().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
  date_of_birth: Joi.date().iso().messages({
    "string": "Date of birth must be a valid ISO date",
  }),

  // phone is usually not allowed to be updated here as it's the unique ID
  // but if you include it, use .required() or .forbidden()
});

//therapist
export const therapistValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is a required field",
  }),

  available_today: Joi.boolean().default(false),

  price_per_session: Joi.number().positive().required(),

  description: Joi.string().max(500).allow("", null),

  rating: Joi.number().min(0).max(5).default(0),

  language: Joi.array().items(Joi.string()).default(["English", "Hindi"]),

  speciality: Joi.array(),

  education_and_experience: Joi.array().items(
    Joi.object({
      category: Joi.string().valid("Education", "Experience").required(),
      title: Joi.string().required(),
      organization: Joi.string().required(),
      year_or_duration: Joi.string().required(),
    }),
  ),

  available_slots: Joi.array().items(Joi.string()),

  status: Joi.string().valid("active", "suspended").default("active"),

  image: Joi.string(),
});

export const therapistUpdateSchema = Joi.object({
  // BLOCK name from being updated
  name: Joi.any().forbidden().messages({
    "any.unknown": "The name field cannot be updated once created.",
  }),

  // All other fields are optional for updates
  available_today: Joi.boolean(),
  price_per_session: Joi.number().positive(),
  description: Joi.string().max(500).allow("", null),
  rating: Joi.number().min(0).max(5),
  language: Joi.array().items(Joi.string()),

  speciality: Joi.array(),

  education_and_experience: Joi.array().items(
    Joi.object({
      category: Joi.string().valid("Education", "Experience").required(),
      title: Joi.string().required(),
      organization: Joi.string().required(),
      year_or_duration: Joi.string().required(),
    }),
  ),

  available_slots: Joi.array().items(Joi.string()),
  status: Joi.string().valid("active", "suspended"),
  image: Joi.string().uri(),
});

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};
