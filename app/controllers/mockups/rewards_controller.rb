module Mockups
  class RewardsController < BaseController
    def index
      @total_points = 450
      @current_level = 'Explorer'
      @next_level = 'Adventurer'
      @progress_to_next = 75
      @achievements = all_achievements
      @recent_activity = recent_activity
    end
    
    def show
      @achievement = find_achievement(params[:id])
    end
    
    private
    
    def all_achievements
      [
        { id: 1, name: 'First Bite', description: 'Log your first meal', points: 10, unlocked: true, icon: '🥄' },
        { id: 2, name: '10 Foods Club', description: 'Try 10 different foods', points: 50, unlocked: true, icon: '🌟' },
        { id: 3, name: 'Week Warrior', description: 'Log meals for 7 days', points: 100, unlocked: true, icon: '📅' },
        { id: 4, name: 'Protein Pro', description: 'Try 5 protein sources', points: 50, unlocked: false, icon: '🍗' },
        { id: 5, name: 'Veggie Victory', description: 'Try 10 vegetables', points: 75, unlocked: false, icon: '🥦' },
        { id: 6, name: 'Allergen Hero', description: 'Introduce all allergens', points: 200, unlocked: false, icon: '🦸' }
      ]
    end
    
    def recent_activity
      [
        { action: 'Tried Banana', points: 5, time: 1.hour.ago },
        { action: 'Logged breakfast', points: 2, time: 3.hours.ago },
        { action: 'Tried Avocado', points: 5, time: 1.day.ago }
      ]
    end
    
    def find_achievement(id)
      all_achievements.find { |a| a[:id] == id.to_i } || all_achievements.first
    end
  end
end
