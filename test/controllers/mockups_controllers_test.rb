require "test_helper"

class Mockups::HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_root_path
    assert_response :success
    assert_select "h1", /Welcome/
  end
end

class Mockups::FoodsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_foods_path
    assert_response :success
    assert_select "h1", "Foods Database"
  end
  
  test "should get show" do
    get mockups_food_path(1)
    assert_response :success
  end
  
  test "should get search" do
    get search_mockups_foods_path(q: "banana")
    assert_response :success
  end
end

class Mockups::MealsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_meals_path
    assert_response :success
  end
  
  test "should get show" do
    get mockups_meal_path(1)
    assert_response :success
  end
  
  test "should get search" do
    get search_mockups_meals_path(q: "banana")
    assert_response :success
  end
end

class Mockups::MealPlanControllerTest < ActionDispatch::IntegrationTest
  test "should get show (week view)" do
    get mockups_meal_plan_path
    assert_response :success
  end
  
  test "should get day view" do
    get day_mockups_meal_plan_path
    assert_response :success
  end
  
  test "should get day view with date" do
    get day_mockups_meal_plan_path(date: Date.today)
    assert_response :success
  end
  
  test "should get month view" do
    get month_mockups_meal_plan_path
    assert_response :success
  end
  
  test "should get feedback" do
    get feedback_mockups_meal_plan_path
    assert_response :success
  end
end

class Mockups::GuidesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_guides_path
    assert_response :success
    assert_select "h1", "Video Guides"
  end
  
  test "should get show" do
    get mockups_guide_path(1)
    assert_response :success
  end
  
  test "should get sensory science category" do
    get sensory_science_mockups_guides_path
    assert_response :success
  end
  
  test "should get feeding therapy category" do
    get feeding_therapy_mockups_guides_path
    assert_response :success
  end
  
  test "should get developmental dining category" do
    get developmental_dining_mockups_guides_path
    assert_response :success
  end
end

class Mockups::ClinicsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_clinics_path
    assert_response :success
    assert_select "h1", "Live Clinics"
  end
  
  test "should get show" do
    get mockups_clinic_path(3)
    assert_response :success
  end
end

class Mockups::RewardsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get mockups_rewards_path
    assert_response :success
  end
end

class Mockups::ProfilesControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get mockups_profile_path
    assert_response :success
    assert_select "h1", /Profile/
  end
end

class Mockups::SettingsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get mockups_settings_path
    assert_response :success
    assert_select "h1", "Settings"
  end
end
