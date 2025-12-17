module Mockups
  class FoodsController < BaseController
    def index
      @categories = food_categories
      @foods = all_foods
      @filter = params[:category]
      
      if @filter.present?
        @foods = @foods.select { |f| f[:category].downcase == @filter.downcase }
      end
    end
    
    def show
      @food = find_food(params[:id])
      @related_meals = sample_meals_with_food(@food[:name])
      @serving_guides = serving_guides_for(@food[:name])
      @active_tab = params[:tab] || 'nutrition'
    end
    
    def search
      query = params[:q].to_s.downcase
      @foods = all_foods.select { |f| f[:name].downcase.include?(query) }
      render :index
    end
    
    private
    
    def food_categories
      [
        { name: 'Fruits', icon: '🍎', count: 15 },
        { name: 'Vegetables', icon: '🥕', count: 20 },
        { name: 'Proteins', icon: '🍗', count: 12 },
        { name: 'Grains', icon: '🌾', count: 8 },
        { name: 'Dairy', icon: '🧀', count: 6 },
        { name: 'Allergens', icon: '⚠️', count: 9 }
      ]
    end
    
    def all_foods
      [
        { id: 1, name: 'Avocado', category: 'Fruit', emoji: '🥑', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: false, exposure_count: 8, last_tried: 2.days.ago },
        { id: 2, name: 'Sweet Potato', category: 'Vegetable', emoji: '🍠', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: false, exposure_count: 12, last_tried: 1.day.ago },
        { id: 3, name: 'Banana', category: 'Fruit', emoji: '🍌', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: true, exposure_count: 15, last_tried: Date.today },
        { id: 4, name: 'Chicken', category: 'Protein', emoji: '🍗', age_months: 6, is_allergen: false, is_iron_rich: true, iron_type: 'heme', is_vitamin_c: false, is_choking_hazard: true, exposure_count: 6, last_tried: 3.days.ago },
        { id: 5, name: 'Broccoli', category: 'Vegetable', emoji: '🥦', age_months: 6, is_allergen: false, is_iron_rich: true, iron_type: 'non-heme', is_vitamin_c: true, is_choking_hazard: true, exposure_count: 4, last_tried: 4.days.ago },
        { id: 6, name: 'Peanut Butter', category: 'Allergen', emoji: '🥜', age_months: 6, is_allergen: true, allergen_type: 'peanut', is_iron_rich: false, is_vitamin_c: false, is_choking_hazard: false, exposure_count: 3, last_tried: 5.days.ago },
        { id: 7, name: 'Egg', category: 'Allergen', emoji: '🥚', age_months: 6, is_allergen: true, allergen_type: 'egg', is_iron_rich: true, iron_type: 'heme', is_vitamin_c: false, is_choking_hazard: false, exposure_count: 7, last_tried: 2.days.ago },
        { id: 8, name: 'Salmon', category: 'Protein', emoji: '🐟', age_months: 6, is_allergen: true, allergen_type: 'fish', is_iron_rich: true, iron_type: 'heme', is_vitamin_c: false, is_choking_hazard: true, exposure_count: 2, last_tried: 6.days.ago },
        { id: 9, name: 'Carrot', category: 'Vegetable', emoji: '🥕', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: true, exposure_count: 10, last_tried: 1.day.ago },
        { id: 10, name: 'Apple', category: 'Fruit', emoji: '🍎', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: true, exposure_count: 9, last_tried: 3.days.ago },
        { id: 11, name: 'Lemon', category: 'Fruit', emoji: '🍋', age_months: 6, is_allergen: false, is_iron_rich: false, is_vitamin_c: true, is_choking_hazard: false, exposure_count: 1, last_tried: 7.days.ago },
        { id: 12, name: 'Beef', category: 'Protein', emoji: '🥩', age_months: 6, is_allergen: false, is_iron_rich: true, iron_type: 'heme', is_vitamin_c: false, is_choking_hazard: true, exposure_count: 5, last_tried: 4.days.ago }
      ]
    end
    
    def find_food(id)
      all_foods.find { |f| f[:id] == id.to_i } || all_foods.first
    end
    
    def sample_meals_with_food(food_name)
      [
        { id: 1, name: "#{food_name} Puree", image: 'puree' },
        { id: 2, name: "#{food_name} Mash", image: 'mash' },
        { id: 3, name: "#{food_name} Fingers", image: 'fingers' }
      ]
    end
    
    def serving_guides_for(food_name)
      {
        '6-9 months' => {
          description: "Serve #{food_name.downcase} as a smooth puree or very soft mash. Start with 1-2 teaspoons and gradually increase.",
          tips: ['Start with smooth texture', 'Offer on a preloaded spoon', 'Let baby explore with hands']
        },
        '9-12 months' => {
          description: "#{food_name} can now be served as soft pieces or thick mash. Baby can start self-feeding.",
          tips: ['Soft, mashable pieces', 'Finger food strips', 'Encourage self-feeding']
        },
        '12-18 months' => {
          description: "Offer #{food_name.downcase} in various textures and as part of mixed dishes.",
          tips: ['Mixed textures OK', 'Include in recipes', 'Family meals together']
        },
        '18-24 months' => {
          description: "#{food_name} can be served in most forms appropriate for toddlers.",
          tips: ['Most textures safe', 'Regular family portions', 'Encourage independence']
        }
      }
    end
  end
end
