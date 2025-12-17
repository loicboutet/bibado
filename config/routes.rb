Rails.application.routes.draw do
  devise_for :users
  
  # Bibado Mockups namespace - Mobile-first weaning app mockups
  namespace :mockups do
    root to: 'home#index'
    
    # Home/Dashboard
    get 'home', to: 'home#show'
    
    # Foods Database
    resources :foods, only: [:index, :show] do
      collection do
        get :search
      end
    end
    
    # Meals/Recipes Database
    resources :meals, only: [:index, :show] do
      collection do
        get :search
      end
    end
    
    # Meal Plan
    resource :meal_plan, only: [:show], controller: 'meal_plan' do
      get :day
      get :week
      get :month
      get :feedback
    end
    
    # Video Guides
    resources :guides, only: [:index, :show] do
      collection do
        get :sensory_science
        get :feeding_therapy
        get :developmental_dining
      end
    end
    
    # Live Clinics
    resources :clinics, only: [:index, :show]
    
    # Weaning Wings (Rewards)
    resources :rewards, only: [:index, :show]
    
    # Profile
    resource :profile, only: [:show, :edit]
    
    # Settings
    resource :settings, only: [:show]
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # Root path - redirect to mockups for now
  root "mockups/home#index"
end
