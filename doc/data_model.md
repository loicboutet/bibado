# Bibado Weaning App - Data Model

## Overview
This document outlines the data model for the Bibado "Weaning With Meaning" application. The app helps parents track their baby's weaning journey with comprehensive food databases, meal plans, and tracking features.

## Core Entities

### User
Represents a parent using the app.
- `id`: integer (primary key)
- `email`: string
- `name`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :babies
- has_many :custom_meal_plans

---

### Baby
Represents the child being weaned.
- `id`: integer (primary key)
- `user_id`: integer (foreign key)
- `name`: string
- `date_of_birth`: date
- `weaning_start_date`: date
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :user
- has_many :food_interactions
- has_many :meal_feedback_entries
- has_one :weaning_progress

---

### Food
Represents individual foods in the database (100+ foods).
- `id`: integer (primary key)
- `name`: string
- `category`: string (fruit, vegetable, protein, grain, dairy, etc.)
- `description`: text
- `suggested_age_months`: integer
- `is_allergen`: boolean
- `allergen_type`: string (peanut, dairy, egg, etc.)
- `is_iron_rich`: boolean
- `iron_type`: string (heme, non-heme)
- `is_vitamin_c_rich`: boolean
- `is_choking_hazard`: boolean
- `milestone_magic`: text
- `nutrition_info`: text (JSON or text)
- `faqs`: text (JSON or text)
- `image_url`: string
- `video_url`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :food_serving_guides
- has_many :food_interactions
- has_many :recipe_ingredients
- has_many :recipes, through: :recipe_ingredients

---

### FoodServingGuide
Represents how to serve a food at different ages.
- `id`: integer (primary key)
- `food_id`: integer (foreign key)
- `age_range`: string (6-9 months, 9-12 months, 12-18 months, 18-24 months)
- `serving_description`: text
- `serving_images`: text (JSON array of URLs)
- `video_url`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :food

---

### FoodInteraction
Tracks a baby's interaction with a specific food (for the tracker).
- `id`: integer (primary key)
- `baby_id`: integer (foreign key)
- `food_id`: integer (foreign key)
- `interaction_date`: date
- `exposure_count`: integer
- `interaction_level`: string (saw, smelt, touched, tasted, chewed, swallowed)
- `texture`: string (puree, mashed, finger_food, whole)
- `allergic_reaction`: boolean
- `allergic_symptoms`: text (JSON array)
- `notes`: text
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :baby
- belongs_to :food

---

### Recipe (Meal)
Represents a meal/recipe in the database (300+ recipes).
- `id`: integer (primary key)
- `name`: string
- `description`: text
- `meal_type`: string (breakfast, am_snack, lunch, pm_snack, dinner)
- `age_from_months`: integer
- `prep_time_minutes`: integer
- `skill_level`: string (easy, medium, advanced)
- `portions`: integer
- `is_vegetarian`: boolean
- `is_vegan`: boolean
- `contains_gluten`: boolean
- `instructions`: text
- `enhancement_notes`: text (for the "extra touches" version)
- `image_url`: string
- `video_url`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :recipe_ingredients
- has_many :foods, through: :recipe_ingredients
- has_many :meal_plan_entries

---

### RecipeIngredient
Links recipes to foods.
- `id`: integer (primary key)
- `recipe_id`: integer (foreign key)
- `food_id`: integer (foreign key)
- `quantity`: string
- `is_optional`: boolean
- `order`: integer
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :recipe
- belongs_to :food

---

### MealPlan
Represents a meal plan template (pre-built or custom).
- `id`: integer (primary key)
- `name`: string
- `description`: text
- `is_template`: boolean (true for Bibado's pre-built plan)
- `user_id`: integer (nullable, for custom plans)
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :meal_plan_entries
- belongs_to :user (optional)

---

### MealPlanEntry
Individual meal entry in a plan for a specific day.
- `id`: integer (primary key)
- `meal_plan_id`: integer (foreign key)
- `recipe_id`: integer (foreign key)
- `day_number`: integer (1-365)
- `meal_slot`: string (breakfast, am_snack, lunch, pm_snack, dinner)
- `order`: integer
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :meal_plan
- belongs_to :recipe

---

### MealFeedbackEntry
Post-meal questionnaire tracking what baby actually ate.
- `id`: integer (primary key)
- `baby_id`: integer (foreign key)
- `meal_plan_entry_id`: integer (foreign key)
- `date`: date
- `was_served`: boolean
- `alternative_recipe_id`: integer (nullable, if different meal served)
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :baby
- belongs_to :meal_plan_entry
- belongs_to :alternative_recipe, class_name: 'Recipe' (optional)
- has_many :meal_feedback_food_items

---

### MealFeedbackFoodItem
Tracks interaction with each food in a meal.
- `id`: integer (primary key)
- `meal_feedback_entry_id`: integer (foreign key)
- `food_id`: integer (foreign key)
- `interaction_level`: string (saw, smelt, touched, tasted, swallowed)
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :meal_feedback_entry
- belongs_to :food

---

### VideoGuide
Educational video content.
- `id`: integer (primary key)
- `title`: string
- `description`: text
- `category`: string (basics, importance, sensory_science, feeding_therapy, developmental_dining)
- `duration_minutes`: integer
- `video_url`: string
- `thumbnail_url`: string
- `order`: integer
- `created_at`: datetime
- `updated_at`: datetime

---

### LiveClinic
Live sessions and recordings.
- `id`: integer (primary key)
- `title`: string
- `description`: text
- `scheduled_at`: datetime
- `is_live`: boolean
- `recording_url`: string (after the event)
- `thumbnail_url`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :clinic_questions

---

### ClinicQuestion
User questions for live clinics.
- `id`: integer (primary key)
- `live_clinic_id`: integer (foreign key)
- `user_id`: integer (foreign key)
- `question`: text
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :live_clinic
- belongs_to :user

---

### WeaningProgress
Tracks overall weaning journey and rewards.
- `id`: integer (primary key)
- `baby_id`: integer (foreign key)
- `total_foods_tried`: integer
- `total_exposures`: integer
- `weaning_wings_points`: integer
- `current_milestone`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :baby
- has_many :achievement_unlocks

---

### Achievement
Weaning Wings achievements/milestones.
- `id`: integer (primary key)
- `name`: string
- `description`: text
- `points_required`: integer
- `icon_url`: string
- `category`: string
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- has_many :achievement_unlocks

---

### AchievementUnlock
Tracks when a baby unlocks an achievement.
- `id`: integer (primary key)
- `weaning_progress_id`: integer (foreign key)
- `achievement_id`: integer (foreign key)
- `unlocked_at`: datetime
- `created_at`: datetime
- `updated_at`: datetime

**Relationships:**
- belongs_to :weaning_progress
- belongs_to :achievement

---

### DailyTip
Tip of the day content.
- `id`: integer (primary key)
- `content`: text
- `date`: date
- `created_at`: datetime
- `updated_at`: datetime

---

## Key Relationships Summary

```
User
  └── has_many :babies
       ├── has_many :food_interactions
       │    └── belongs_to :food
       ├── has_many :meal_feedback_entries
       │    └── has_many :meal_feedback_food_items
       └── has_one :weaning_progress
            └── has_many :achievement_unlocks

Food
  ├── has_many :food_serving_guides
  ├── has_many :recipe_ingredients
  └── has_many :recipes (through recipe_ingredients)

Recipe
  ├── has_many :recipe_ingredients
  ├── has_many :foods (through recipe_ingredients)
  └── has_many :meal_plan_entries

MealPlan
  └── has_many :meal_plan_entries
       └── belongs_to :recipe
```

## Notes on Implementation

1. **Flexible Textures**: Food interactions track different textures (puree, mashed, finger food, whole) to align with progression tracking.

2. **Exposure Counting**: The app counts up to 15 exposures per food, tracked through food_interactions.

3. **Meal Plan Flexibility**: MVP version will be non-editable, but the data model supports future customization through user-specific meal plans.

4. **Calendar Integration**: Day numbers (1-365) allow flexible date calculations based on baby's weaning start date.

5. **Integration Points**: Recipe ingredients link foods and recipes, enabling navigation between food pages and recipe pages.

6. **Feedback Loop**: Post-meal questionnaires (meal_feedback_entries) update food_interactions and weaning_progress automatically.

7. **Content Management**: Admin users can manage foods, recipes, videos, and tips independently through a backend interface.
