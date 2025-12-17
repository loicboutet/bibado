module Mockups
  class MealPlanController < BaseController
    def show
      @view_type = params[:view] || 'week'
      @current_week = params[:week]&.to_i || 2
      @current_date = Date.today
      @week_meals = week_meals_data
      @month_data = month_data
      @foods_tried_this_week = foods_tried_this_week
      @allergens_tried = allergens_tried
    end
    
    def day
      @date = params[:date] ? Date.parse(params[:date]) : Date.today
      @day_meals = day_meals_data(@date)
      @foods_tried = foods_tried_this_week.first(3)
    end
    
    def week
      @current_week = params[:week]&.to_i || 2
      @week_meals = week_meals_data
      @foods_tried_this_week = foods_tried_this_week
      @allergens_tried = allergens_tried
    end
    
    def month
      @month = params[:month]&.to_i || Date.today.month
      @year = params[:year]&.to_i || Date.today.year
      @month_data = month_data
    end
    
    def feedback
      @current_meal = {
        name: 'Banana Porridge',
        emoji: '🍌',
        time: 'Breakfast',
        foods: [
          { id: 3, name: 'Banana', emoji: '🍌' },
          { id: 11, name: 'Oats', emoji: '🌾' },
          { id: 12, name: 'Milk', emoji: '🥛' }
        ],
        optional_extra: 'Cinnamon'
      }
    end
    
    private
    
    def week_meals_data
      days = %w[Mon Tue Wed Thu Fri Sat Sun]
      slots = %w[Breakfast AM\ Snack Lunch PM\ Snack Dinner]
      
      days.map.with_index do |day, day_idx|
        {
          day: day,
          date: Date.today.beginning_of_week + day_idx,
          meals: slots.map.with_index do |slot, slot_idx|
            # Early weaning: only breakfast and lunch
            if day_idx < 3 && slot_idx > 2
              nil
            else
              sample_meal_for_slot(slot, day_idx, slot_idx)
            end
          end
        }
      end
    end
    
    def sample_meal_for_slot(slot, day_idx, slot_idx)
      meals = {
        'Breakfast' => [
          { id: 1, name: 'Banana Porridge', emoji: '🍌' },
          { id: 4, name: 'Avocado Toast', emoji: '🥑' },
          { id: 10, name: 'Egg & Soldiers', emoji: '🥚' },
          { id: 12, name: 'Banana Pancakes', emoji: '🥞' }
        ],
        'AM Snack' => [
          { id: 9, name: 'Carrot Sticks', emoji: '🥕' },
          { id: 7, name: 'Apple Slices', emoji: '🍎' }
        ],
        'Lunch' => [
          { id: 2, name: 'Sweet Potato Mash', emoji: '🍠' },
          { id: 8, name: 'Salmon Cakes', emoji: '🐟' }
        ],
        'PM Snack' => [
          { id: 6, name: 'Broccoli Bites', emoji: '🥦' }
        ],
        'Dinner' => [
          { id: 3, name: 'Chicken Puree', emoji: '🍗' },
          { id: 5, name: 'Spaghetti Bolognese', emoji: '🍝' },
          { id: 11, name: 'Beef Stew', emoji: '🥩' }
        ]
      }
      
      options = meals[slot] || meals['Lunch']
      options[(day_idx + slot_idx) % options.length]
    end
    
    def day_meals_data(date)
      slots = ['Breakfast', 'AM Snack', 'Lunch', 'PM Snack', 'Dinner']
      slots.map.with_index do |slot, idx|
        meal = sample_meal_for_slot(slot, date.wday, idx)
        {
          slot: slot,
          meal: meal,
          time: slot_time(slot)
        }
      end
    end
    
    def slot_time(slot)
      case slot
      when 'Breakfast' then '7:30 AM'
      when 'AM Snack' then '10:00 AM'
      when 'Lunch' then '12:30 PM'
      when 'PM Snack' then '3:00 PM'
      when 'Dinner' then '5:30 PM'
      end
    end
    
    def month_data
      start_date = Date.today.beginning_of_month
      end_date = Date.today.end_of_month
      
      (start_date..end_date).map do |date|
        {
          date: date,
          has_meals: date <= Date.today,
          meal_indicators: [
            date.wday != 0, # breakfast  
            date.wday > 3, # am snack
            true, # lunch
            date.wday > 3, # pm snack
            date.wday != 6 # dinner
          ]
        }
      end
    end
    
    def foods_tried_this_week
      [
        { name: 'Banana', emoji: '🍌', count: 4 },
        { name: 'Avocado', emoji: '🥑', count: 3 },
        { name: 'Sweet Potato', emoji: '🍠', count: 5 },
        { name: 'Chicken', emoji: '🍗', count: 2 },
        { name: 'Oats', emoji: '🌾', count: 4 }
      ]
    end
    
    def allergens_tried
      [
        { name: 'Egg', emoji: '🥚', status: 'introduced' },
        { name: 'Dairy', emoji: '🧀', status: 'introduced' },
        { name: 'Peanut', emoji: '🥜', status: 'pending' }
      ]
    end
  end
end
