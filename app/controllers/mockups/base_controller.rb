module Mockups
  class BaseController < ApplicationController
    layout 'mockup_mobile'
    
    # Skip authentication for mockups
    skip_before_action :authenticate_user!, raise: false
    
    # Helper method to provide sample baby name
    helper_method :baby_name, :weaning_day
    
    private
    
    def baby_name
      "Oliver"
    end
    
    def weaning_day
      45 # Day 45 of weaning journey
    end
  end
end
