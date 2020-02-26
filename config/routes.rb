Rails.application.routes.draw do
  root 'game#play'
  get 'randomchar', to: 'game#randomchar'
  get 'game/play'
  # get 'game/play'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
