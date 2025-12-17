module Mockups
  class SettingsController < BaseController
    def show
      @notifications = {
        meal_reminders: true,
        daily_tips: true,
        achievements: true,
        offers: false
      }
    end
  end
end
