class GameController < ApplicationController
  def play
  end

  def randomchar
    @charset=Array('A'...'Z')
    @chararray=Array.new(16){@charset.sample}
    render json:@chararray
  end
end
