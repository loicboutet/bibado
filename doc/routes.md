# Bibado Weaning App - Routes

## Overview
This document defines all routes for the Bibado "Weaning With Meaning" application. Routes are organized by user type and functional area.

---

## User Types
1. **Parent/User**: Regular app users (parents/caregivers)
2. **Admin**: Bibado team members who manage content

---

## Public Routes (No Authentication)

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Landing/marketing page |
| `/login` | GET | Login page |
| `/login` | POST | Process login |
| `/signup` | GET | Registration page |
| `/signup` | POST | Process registration |
| `/password/forgot` | GET | Forgot password page |
| `/password/forgot` | POST | Send reset email |
| `/password/reset/:token` | GET | Reset password form |
| `/password/reset/:token` | PATCH | Process password reset |

---

## Parent/User Routes (Authenticated)

### Dashboard & Home

| Route | Method | Description |
|-------|--------|-------------|
| `/home` | GET | User homepage with personalized content, tip of day, quick access |
| `/profile` | GET | User profile page |
| `/profile` | PATCH | Update user profile |
| `/babies` | GET | List babies |
| `/babies/new` | GET | Add new baby form |
| `/babies` | POST | Create new baby |
| `/babies/:id` | GET | Baby details |
| `/babies/:id/edit` | GET | Edit baby form |
| `/babies/:id` | PATCH | Update baby |
| `/babies/:id` | DELETE | Remove baby |

### Foods Database

| Route | Method | Description |
|-------|--------|-------------|
| `/foods` | GET | Foods list/index with categories and filtering |
| `/foods/search` | GET | Search foods (query param: `?q=`) |
| `/foods/category/:category` | GET | Filter by category (fruit, vegetable, etc.) |
| `/foods/:id` | GET | Individual food page with nutrition, how to serve, progress, FAQs |

### Food Progress Tracking

| Route | Method | Description |
|-------|--------|-------------|
| `/foods/:food_id/interactions` | GET | View all interactions with this food for baby |
| `/foods/:food_id/interactions` | POST | Log new interaction with food |
| `/foods/:food_id/interactions/:id` | PATCH | Update interaction (notes, allergic reactions) |
| `/foods/:food_id/allergic_reaction` | POST | Log allergic reaction |

### Meals/Recipes Database

| Route | Method | Description |
|-------|--------|-------------|
| `/meals` | GET | Meals collection page with categories |
| `/meals/search` | GET | Search meals (query param: `?q=`) |
| `/meals/category/:category` | GET | Filter by category (breakfast, lunch, etc.) |
| `/meals/filter` | GET | Filter meals (vegetarian, gluten-free, age, etc.) |
| `/meals/:id` | GET | Individual recipe page with ingredients, instructions |

### Meal Plans

| Route | Method | Description |
|-------|--------|-------------|
| `/meal-plan` | GET | Current meal plan view (defaults to week view) |
| `/meal-plan/day/:date` | GET | Day view for specific date |
| `/meal-plan/week/:week_number` | GET | Week view |
| `/meal-plan/month/:month` | GET | Month view |
| `/meal-plan/entry/:id` | GET | View meal plan entry details (modal/overlay) |
| `/meal-plan/entry/:id/swap` | GET | Show swap options for a meal |
| `/meal-plan/entry/:id/swap` | POST | Swap meal with alternative |
| `/meal-plan/entry/:id/move` | PATCH | Move meal to different slot/day |

### Post-Meal Feedback (Questionnaire)

| Route | Method | Description |
|-------|--------|-------------|
| `/feedback/new` | GET | Post-meal questionnaire form |
| `/feedback` | POST | Submit meal feedback |
| `/feedback/:id` | GET | View past feedback entry |
| `/feedback/history` | GET | View feedback history |

### Video Guides & Learning

| Route | Method | Description |
|-------|--------|-------------|
| `/guides` | GET | Video guides library/collection |
| `/guides/:category` | GET | Filter by category (basics, sensory, feeding_therapy, developmental) |
| `/guides/:id` | GET | Individual video guide page |
| `/guides/sensory-science` | GET | Sensory science section |
| `/guides/feeding-therapy` | GET | Feeding therapy section |
| `/guides/developmental-dining` | GET | Developmental dining section |

### Live Clinics

| Route | Method | Description |
|-------|--------|-------------|
| `/clinics` | GET | Live clinics list (upcoming and past) |
| `/clinics/upcoming` | GET | Upcoming live clinics |
| `/clinics/past` | GET | Past clinic recordings |
| `/clinics/:id` | GET | Individual clinic page/player |
| `/clinics/:id/questions` | GET | View questions for a clinic |
| `/clinics/:id/questions` | POST | Submit a question |

### Weaning Wings (Rewards)

| Route | Method | Description |
|-------|--------|-------------|
| `/rewards` | GET | Weaning Wings dashboard |
| `/rewards/achievements` | GET | All achievements list |
| `/rewards/achievements/:id` | GET | Achievement details |
| `/rewards/milestones` | GET | Milestones progress |

### First Aid (Future Feature)

| Route | Method | Description |
|-------|--------|-------------|
| `/first-aid` | GET | First aid information section |

### Settings & Account

| Route | Method | Description |
|-------|--------|-------------|
| `/settings` | GET | App settings |
| `/settings/notifications` | GET | Notification preferences |
| `/settings/notifications` | PATCH | Update notification preferences |
| `/logout` | DELETE | Logout |

---

## Admin Routes (Authenticated + Admin Role)

### Admin Dashboard

| Route | Method | Description |
|-------|--------|-------------|
| `/admin` | GET | Admin dashboard |
| `/admin/analytics` | GET | App analytics and metrics |

### Foods Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/foods` | GET | List all foods |
| `/admin/foods/new` | GET | New food form |
| `/admin/foods` | POST | Create food |
| `/admin/foods/:id` | GET | View food details |
| `/admin/foods/:id/edit` | GET | Edit food form |
| `/admin/foods/:id` | PATCH | Update food |
| `/admin/foods/:id` | DELETE | Delete food |
| `/admin/foods/:id/serving_guides` | GET | Manage serving guides |
| `/admin/foods/:id/serving_guides/new` | GET | New serving guide form |
| `/admin/foods/:id/serving_guides` | POST | Create serving guide |
| `/admin/foods/:id/serving_guides/:guide_id` | PATCH | Update serving guide |
| `/admin/foods/:id/serving_guides/:guide_id` | DELETE | Delete serving guide |

### Meals/Recipes Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/meals` | GET | List all meals |
| `/admin/meals/new` | GET | New meal form |
| `/admin/meals` | POST | Create meal |
| `/admin/meals/:id` | GET | View meal details |
| `/admin/meals/:id/edit` | GET | Edit meal form |
| `/admin/meals/:id` | PATCH | Update meal |
| `/admin/meals/:id` | DELETE | Delete meal |
| `/admin/meals/:id/ingredients` | GET | Manage ingredients |
| `/admin/meals/:id/ingredients` | POST | Add ingredient |
| `/admin/meals/:id/ingredients/:ingredient_id` | DELETE | Remove ingredient |

### Meal Plans Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/meal_plans` | GET | List meal plan templates |
| `/admin/meal_plans/new` | GET | New meal plan form |
| `/admin/meal_plans` | POST | Create meal plan |
| `/admin/meal_plans/:id` | GET | View meal plan |
| `/admin/meal_plans/:id/edit` | GET | Edit meal plan |
| `/admin/meal_plans/:id` | PATCH | Update meal plan |
| `/admin/meal_plans/:id` | DELETE | Delete meal plan |
| `/admin/meal_plans/:id/entries` | GET | Manage entries |
| `/admin/meal_plans/:id/entries` | POST | Add entry |
| `/admin/meal_plans/:id/entries/:entry_id` | PATCH | Update entry |
| `/admin/meal_plans/:id/entries/:entry_id` | DELETE | Remove entry |

### Video Guides Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/guides` | GET | List all video guides |
| `/admin/guides/new` | GET | New video guide form |
| `/admin/guides` | POST | Create video guide |
| `/admin/guides/:id` | GET | View video guide |
| `/admin/guides/:id/edit` | GET | Edit video guide form |
| `/admin/guides/:id` | PATCH | Update video guide |
| `/admin/guides/:id` | DELETE | Delete video guide |

### Live Clinics Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/clinics` | GET | List all clinics |
| `/admin/clinics/new` | GET | New clinic form |
| `/admin/clinics` | POST | Create clinic |
| `/admin/clinics/:id` | GET | View clinic |
| `/admin/clinics/:id/edit` | GET | Edit clinic form |
| `/admin/clinics/:id` | PATCH | Update clinic |
| `/admin/clinics/:id` | DELETE | Delete clinic |

### Achievements Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/achievements` | GET | List all achievements |
| `/admin/achievements/new` | GET | New achievement form |
| `/admin/achievements` | POST | Create achievement |
| `/admin/achievements/:id` | GET | View achievement |
| `/admin/achievements/:id/edit` | GET | Edit achievement form |
| `/admin/achievements/:id` | PATCH | Update achievement |
| `/admin/achievements/:id` | DELETE | Delete achievement |

### Daily Tips Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/tips` | GET | List all tips |
| `/admin/tips/new` | GET | New tip form |
| `/admin/tips` | POST | Create tip |
| `/admin/tips/:id` | GET | View tip |
| `/admin/tips/:id/edit` | GET | Edit tip form |
| `/admin/tips/:id` | PATCH | Update tip |
| `/admin/tips/:id` | DELETE | Delete tip |

### Users Management

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/users` | GET | List all users |
| `/admin/users/:id` | GET | View user details |
| `/admin/users/:id/edit` | GET | Edit user |
| `/admin/users/:id` | PATCH | Update user |

---

## API Routes (For Mobile Apps - Future)

All API routes would be prefixed with `/api/v1/` and return JSON responses.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/v1/foods` | GET | List foods |
| `/api/v1/foods/:id` | GET | Get food |
| `/api/v1/meals` | GET | List meals |
| `/api/v1/meals/:id` | GET | Get meal |
| `/api/v1/meal_plan` | GET | Get user's meal plan |
| `/api/v1/interactions` | POST | Log food interaction |
| `/api/v1/feedback` | POST | Submit meal feedback |
| `/api/v1/profile` | GET | Get user profile |
| `/api/v1/profile` | PATCH | Update profile |

---

## Rails Routes Configuration

```ruby
# config/routes.rb

Rails.application.routes.draw do
  # Devise routes for authentication
  devise_for :users

  # Root
  root 'home#landing'
  
  # Authenticated user routes
  authenticate :user do
    get 'home', to: 'home#index'
    
    # Profile & Babies
    resource :profile, only: [:show, :edit, :update]
    resources :babies
    
    # Foods
    resources :foods, only: [:index, :show] do
      collection do
        get :search
        get 'category/:category', action: :category, as: :category
      end
      resources :interactions, only: [:index, :create, :update]
      post :allergic_reaction
    end
    
    # Meals
    resources :meals, only: [:index, :show] do
      collection do
        get :search
        get 'category/:category', action: :category, as: :category
        get :filter
      end
    end
    
    # Meal Plan
    resource :meal_plan, only: [:show] do
      get 'day/:date', action: :day, as: :day
      get 'week/:week_number', action: :week, as: :week
      get 'month/:month', action: :month, as: :month
      resources :entries, only: [:show] do
        get :swap
        post :swap, action: :perform_swap
        patch :move
      end
    end
    
    # Feedback
    resources :feedback, only: [:index, :new, :create, :show] do
      collection do
        get :history
      end
    end
    
    # Guides
    resources :guides, only: [:index, :show] do
      collection do
        get ':category', action: :category, as: :category
        get 'sensory-science', action: :sensory_science
        get 'feeding-therapy', action: :feeding_therapy
        get 'developmental-dining', action: :developmental_dining
      end
    end
    
    # Clinics
    resources :clinics, only: [:index, :show] do
      collection do
        get :upcoming
        get :past
      end
      resources :questions, only: [:index, :create]
    end
    
    # Rewards
    resources :rewards, only: [:index] do
      collection do
        get :achievements
        get :milestones
      end
    end
    get 'rewards/achievements/:id', to: 'rewards#achievement_show', as: :achievement
    
    # Settings
    resource :settings, only: [:show] do
      get :notifications
      patch :notifications, action: :update_notifications
    end
  end
  
  # Admin namespace
  namespace :admin do
    root 'dashboard#index'
    get :analytics, to: 'dashboard#analytics'
    
    resources :foods do
      resources :serving_guides, except: [:show]
    end
    
    resources :meals do
      resources :ingredients, only: [:index, :create, :destroy]
    end
    
    resources :meal_plans do
      resources :entries, only: [:index, :create, :update, :destroy]
    end
    
    resources :guides
    resources :clinics
    resources :achievements
    resources :tips
    resources :users, only: [:index, :show, :edit, :update]
  end
end
```

---

## Mockup Routes (For Development)

For the mockup/prototype phase, all routes will be scoped under `/mockups`:

| Route | Description |
|-------|-------------|
| `/mockups` | Index of all mockup pages |
| `/mockups/home` | Homepage mockup |
| `/mockups/foods` | Foods list mockup |
| `/mockups/foods/:id` | Food detail mockup |
| `/mockups/meals` | Meals list mockup |
| `/mockups/meals/:id` | Meal detail mockup |
| `/mockups/meal_plan` | Meal plan mockup |
| `/mockups/meal_plan/day` | Day view mockup |
| `/mockups/meal_plan/week` | Week view mockup |
| `/mockups/meal_plan/month` | Month view mockup |
| `/mockups/guides` | Video guides mockup |
| `/mockups/guides/:id` | Video guide detail mockup |
| `/mockups/clinics` | Live clinics mockup |
| `/mockups/rewards` | Weaning Wings mockup |
| `/mockups/feedback` | Post-meal feedback mockup |
| `/mockups/profile` | Profile mockup |

---

## Navigation Structure

### Bottom Navigation (Mobile)
1. Home
2. Foods
3. Meals
4. Plan
5. More (expandable menu)

### Burger Menu
- Home
- Foods Database
- Meals Database
- Meal Plan
- Video Guides
  - All Guides
  - Sensory Science
  - Feeding Therapy
  - Developmental Dining
- Live Clinics
- Weaning Wings
- Profile
- Settings
- Help/Support
