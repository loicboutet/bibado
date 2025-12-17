module Mockups
  class ProfilesController < BaseController
    def show
      @user_name = 'Sarah'
      @email = 'sarah@example.com'
      @baby = { name: baby_name, dob: 6.months.ago, weaning_start: 45.days.ago }
    end
    
    def edit
      @user_name = 'Sarah'
      @email = 'sarah@example.com' 
      @baby = { name: baby_name, dob: 6.months.ago, weaning_start: 45.days.ago }
    end
  end
end
