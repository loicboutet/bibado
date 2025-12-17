module Mockups
  class GuidesController < BaseController
    def index
      @guides = all_guides
      @categories = guide_categories
    end
    
    def show
      @guide = find_guide(params[:id])
      @related_guides = all_guides.reject { |g| g[:id] == @guide[:id] }.first(3)
    end
    
    def sensory_science
      @category = 'Sensory Science'
      @guides = all_guides.select { |g| g[:category] == 'sensory_science' }
      render :category
    end
    
    def feeding_therapy
      @category = 'Feeding Therapy'
      @guides = all_guides.select { |g| g[:category] == 'feeding_therapy' }
      render :category
    end
    
    def developmental_dining
      @category = 'Developmental Dining'
      @guides = all_guides.select { |g| g[:category] == 'developmental_dining' }
      render :category
    end
    
    private
    
    def guide_categories
      [
        { id: 'basics', name: 'Getting Started', icon: '🎯', color: '#FF6B6B' },
        { id: 'sensory_science', name: 'Sensory Science', icon: '🧪', color: '#4ECDC4' },
        { id: 'feeding_therapy', name: 'Feeding Therapy', icon: '💚', color: '#95D5B2' },
        { id: 'developmental_dining', name: 'Developmental Dining', icon: '🧠', color: '#FFE66D' }
      ]
    end
    
    def all_guides
      [
        { id: 1, title: 'Getting Started with Weaning', category: 'basics', duration: 5, thumbnail: '🎬', description: 'Everything you need to know to start your weaning journey.' },
        { id: 2, title: 'First Foods Guide', category: 'basics', duration: 8, thumbnail: '🥑', description: 'Learn about the best first foods for your baby.' },
        { id: 3, title: 'Safety Tips & Choking Prevention', category: 'basics', duration: 6, thumbnail: '🚨', description: 'Essential safety information every parent needs.' },
        { id: 4, title: 'Understanding Baby\'s Senses', category: 'sensory_science', duration: 7, thumbnail: '🧪', description: 'How babies experience food through their senses.' },
        { id: 5, title: 'Texture Progression', category: 'sensory_science', duration: 5, thumbnail: '🔬', description: 'Moving from purees to finger foods safely.' },
        { id: 6, title: 'When to Seek Help', category: 'feeding_therapy', duration: 4, thumbnail: '💚', description: 'Signs that may indicate feeding difficulties.' },
        { id: 7, title: 'Supporting Picky Eaters', category: 'feeding_therapy', duration: 6, thumbnail: '🍽️', description: 'Strategies for encouraging reluctant eaters.' },
        { id: 8, title: 'Why Weaning Matters', category: 'developmental_dining', duration: 5, thumbnail: '🧠', description: 'The developmental benefits of weaning with meaning.' },
        { id: 9, title: 'Family Mealtimes', category: 'developmental_dining', duration: 4, thumbnail: '👨‍👩‍👧', description: 'Creating positive mealtime experiences.' }
      ]
    end
    
    def find_guide(id)
      all_guides.find { |g| g[:id] == id.to_i } || all_guides.first
    end
  end
end
