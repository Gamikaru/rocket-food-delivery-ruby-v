Rails.application.routes.draw do
  # Routes accessible without authentication
  root to: "home#index"

  # Devise routes for authentication (e.g., sign in, sign out)
  devise_for :users, skip: [:registrations],
             # path: '' ,
             path_names: { sign_in: 'sign_in', sign_out: 'sign_out' }

  # Routes that require authentication
  authenticate :user do
    resources :employees
    resources :users
    resources :customers
    resources :restaurants
    resources :addresses
    resources :products
    resources :product_orders
    resources :orders
    resources :order_statuses
  end

  # API
  namespace :api do
    post "login", to: "api_auth#index"
    get "restaurants", to: "api_restaurants#index"
    get "products", to: "api_products#index"
    get "orders", to: "api_orders#index"
    post "orders", to: "api_orders#create"
    post "order/:id/status", to: "api_orders#set_status"
    post "order/:id/rating", to: "api_orders#set_rating"
    get "account/:id", to: "api_auth#get_account"
    post "account/:id", to: "api_auth#update_account"
  end

  # Redirect to home for unwanted Devise routes
  # get '*path', to: redirect('/')

  # Redirect to home for any other routes
  # get '*unmatched_route', to: redirect('/')

  # unauthenticated do
  #   root to: redirect('/users/sign_in'), as: :unauthenticated_root
  # end

end
