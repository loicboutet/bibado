module Mockups
  class ClinicsController < BaseController
    def index
      @upcoming_clinics = upcoming_clinics
      @past_clinics = past_clinics
    end
    
    def show
      @clinic = find_clinic(params[:id])
    end
    
    private
    
    def upcoming_clinics
      [
        { id: 1, title: 'Q&A: First Foods', date: 3.days.from_now, host: 'Dr. Sarah', is_live: false },
        { id: 2, title: 'Allergen Introduction', date: 1.week.from_now, host: 'Nutritionist Amy', is_live: false }
      ]
    end
    
    def past_clinics
      [
        { id: 3, title: 'Picky Eaters', date: 1.week.ago, host: 'Dr. Sarah', recording_url: '#', views: 234 },
        { id: 4, title: 'Texture Progression', date: 2.weeks.ago, host: 'Feeding Therapist Jo', recording_url: '#', views: 456 },
        { id: 5, title: 'Starting Solids', date: 3.weeks.ago, host: 'Dr. Sarah', recording_url: '#', views: 789 }
      ]
    end
    
    def find_clinic(id)
      (upcoming_clinics + past_clinics).find { |c| c[:id] == id.to_i } || past_clinics.first
    end
  end
end
