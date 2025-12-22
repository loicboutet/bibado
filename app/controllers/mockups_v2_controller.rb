class MockupsV2Controller < ApplicationController
  layout 'mockup_v2'
  
  # Skip authentication for mockups
  skip_before_action :authenticate_user!, raise: false
  
  def food_details
    # Food details page - Avocado example
  end
  
  def meal_planner
    # Meal planner page
  end
end
