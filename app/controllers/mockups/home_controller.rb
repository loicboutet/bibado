module Mockups
  class HomeController < BaseController
    def index
      # Main homepage/dashboard
      @tip_of_day = "Did you know? Babies need to be exposed to a new food up to 15 times before they may accept it. Keep trying!"
      @recent_foods = sample_foods.first(5)
      @upcoming_meals = sample_upcoming_meals
    end
    
    def show
      # Alternative home view
      redirect_to action: :index
    end
    
    private
    
    def sample_foods
      [
        { id: 1, name: 'Avocado', category: 'Fruit', emoji: '🥑', exposure_count: 8, last_tried: 2.days.ago },
        { id: 2, name: 'Sweet Potato', category: 'Vegetable', emoji: '🍠', exposure_count: 12, last_tried: 1.day.ago },
        { id: 3, name: 'Banana', category: 'Fruit', emoji: '🍌', exposure_count: 15, last_tried: Date.today },
        { id: 4, name: 'Chicken', category: 'Protein', emoji: '🍗', exposure_count: 6, last_tried: 3.days.ago },
        { id: 5, name: 'Broccoli', category: 'Vegetable', emoji: '🥦', exposure_count: 4, last_tried: 4.days.ago }
      ]
    end
    
    def sample_upcoming_meals
      [
        { id: 1, name: 'Breakfast', time: 'Today, 8:00 AM', meal: 'Banana Porridge' },
        { id: 2, name: 'Lunch', time: 'Today, 12:00 PM', meal: 'Sweet Potato Mash' },
        { id: 3, name: 'Dinner', time: 'Today, 5:30 PM', meal: 'Chicken & Veggie Puree' }
      ]
    end
  end
end
