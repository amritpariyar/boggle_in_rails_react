require 'test_helper'

class GameControllerTest < ActionDispatch::IntegrationTest
  test "should get play" do
    get game_play_url
    assert_response :success
  end

  test "should generate 16 size array of characters" do
    get randomchar_url, xhr: true
    @charset = Array('A'...'Z')
    @chararray=Array.new(16){@charset.sample}
    assert_equal @chararray.length, 16
    # assert_not_includes @charset, @chararray, @response.body
    assert_equal "application/json", @response.media_type
  end
end
