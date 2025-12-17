module Mockups
  class MealsController < BaseController
    def index
      @categories = meal_categories
      @meals = all_meals
      @filter = params[:category]
      
      if @filter.present?
        @meals = @meals.select { |m| m[:meal_type].downcase == @filter.downcase }
      end
    end
    
    def show
      @meal = find_meal(params[:id])
      @ingredients = ingredients_for(@meal[:id])
      @active_tab = params[:tab] || 'ingredients'
    end
    
    def search
      query = params[:q].to_s.downcase
      @meals = all_meals.select { |m| m[:name].downcase.include?(query) }
      @categories = meal_categories
      render :index
    end
    
    private
    
    def meal_categories
      [
        { name: 'Breakfast', icon: '🌅', count: 45 },
        { name: 'Lunch', icon: '☀️', count: 80 },
        { name: 'Dinner', icon: '🌙', count: 90 },
        { name: 'Snacks', icon: '🍪', count: 50 },
        { name: 'Purees', icon: '🥣', count: 35 }
      ]
    end
    
    def all_meals
      [
        { id: 1, name: 'Banana Porridge', meal_type: 'Breakfast', emoji: '🍌', age_months: 6, prep_time: 5, skill_level: 'Easy', portions: 1, is_vegetarian: true, is_vegan: false, contains_gluten: true, times_made: 5 },
        { id: 2, name: 'Sweet Potato Mash', meal_type: 'Lunch', emoji: '🍠', age_months: 6, prep_time: 10, skill_level: 'Easy', portions: 2, is_vegetarian: true, is_vegan: true, contains_gluten: false, times_made: 8 },
        { id: 3, name: 'Chicken & Veggie Puree', meal_type: 'Dinner', emoji: '🍗', age_months: 6, prep_time: 15, skill_level: 'Medium', portions: 4, is_vegetarian: false, is_vegan: false, contains_gluten: false, times_made: 3 },
        { id: 4, name: 'Avocado Toast Fingers', meal_type: 'Breakfast', emoji: '🥑', age_months: 8, prep_time: 5, skill_level: 'Easy', portions: 1, is_vegetarian: true, is_vegan: true, contains_gluten: true, times_made: 12 },
        { id: 5, name: 'Spaghetti Bolognese', meal_type: 'Dinner', emoji: '🍝', age_months: 9, prep_time: 25, skill_level: 'Medium', portions: 6, is_vegetarian: false, is_vegan: false, contains_gluten: true, times_made: 2 },
        { id: 6, name: 'Broccoli & Cheese Bites', meal_type: 'Snacks', emoji: '🥦', age_months: 9, prep_time: 20, skill_level: 'Medium', portions: 12, is_vegetarian: true, is_vegan: false, contains_gluten: true, times_made: 0 },
        { id: 7, name: 'Apple & Pear Puree', meal_type: 'Purees', emoji: '🍎', age_months: 6, prep_time: 10, skill_level: 'Easy', portions: 4, is_vegetarian: true, is_vegan: true, contains_gluten: false, times_made: 15 },
        { id: 8, name: 'Salmon Fish Cakes', meal_type: 'Lunch', emoji: '🐟', age_months: 9, prep_time: 30, skill_level: 'Advanced', portions: 8, is_vegetarian: false, is_vegan: false, contains_gluten: true, times_made: 1 },
        { id: 9, name: 'Carrot Sticks with Hummus', meal_type: 'Snacks', emoji: '🥕', age_months: 8, prep_time: 5, skill_level: 'Easy', portions: 2, is_vegetarian: true, is_vegan: true, contains_gluten: false, times_made: 7 },
        { id: 10, name: 'Egg & Soldiers', meal_type: 'Breakfast', emoji: '🥚', age_months: 6, prep_time: 10, skill_level: 'Easy', portions: 1, is_vegetarian: true, is_vegan: false, contains_gluten: true, times_made: 9 },
        { id: 11, name: 'Beef & Root Veg Stew', meal_type: 'Dinner', emoji: '🥩', age_months: 9, prep_time: 45, skill_level: 'Advanced', portions: 8, is_vegetarian: false, is_vegan: false, contains_gluten: false, times_made: 2 },
        { id: 12, name: 'Banana Pancakes', meal_type: 'Breakfast', emoji: '🥞', age_months: 8, prep_time: 15, skill_level: 'Easy', portions: 6, is_vegetarian: true, is_vegan: false, contains_gluten: true, times_made: 4 }
      ]
    end
    
    def find_meal(id)
      all_meals.find { |m| m[:id] == id.to_i } || all_meals.first
    end
    
    def ingredients_for(meal_id)
      base_ingredients = [
        { food_id: 1, name: 'Main Ingredient', emoji: '🍽️', quantity: '100g', is_optional: false },
        { food_id: 2, name: 'Secondary', emoji: '🥄', quantity: '50g', is_optional: false },
        { food_id: 3, name: 'Seasoning', emoji: '🧂', quantity: 'pinch', is_optional: true },
        { food_id: 4, name: 'Oil/Butter', emoji: '🧈', quantity: '1 tsp', is_optional: false },
        { food_id: 5, name: 'Water/Stock', emoji: '💧', quantity: '100ml', is_optional: false }
      ]
      
      # Customize based on meal
      case meal_id
      when 1 # Banana Porridge
        [
          { food_id: 3, name: 'Banana', emoji: '🍌', quantity: '1 ripe', is_optional: false },
          { food_id: 11, name: 'Oats', emoji: '🌾', quantity: '30g', is_optional: false },
          { food_id: 12, name: 'Milk', emoji: '🥛', quantity: '100ml', is_optional: false },
          { food_id: 13, name: 'Cinnamon', emoji: '✨', quantity: 'pinch', is_optional: true }
        ]
      when 5 # Spaghetti Bolognese
        [
          { food_id: 12, name: 'Beef Mince', emoji: '🥩', quantity: '200g', is_optional: false },
          { food_id: 9, name: 'Carrot', emoji: '🥕', quantity: '1 medium', is_optional: false },
          { food_id: 14, name: 'Tomatoes', emoji: '🍅', quantity: '400g tin', is_optional: false },
          { food_id: 15, name: 'Spaghetti', emoji: '🍝', quantity: '100g', is_optional: false },
          { food_id: 16, name: 'Onion', emoji: '🧅', quantity: '1 small', is_optional: false }
        ]
      else
        base_ingredients
      end
    end
  end
end
