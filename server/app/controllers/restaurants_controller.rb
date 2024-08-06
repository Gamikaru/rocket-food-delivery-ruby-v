class RestaurantsController < ApplicationController
  # before_action :require_authentication
  before_action :set_restaurant, only: [:show, :edit, :update]

  def index
    @restaurants = Restaurant.all
  end

  def new
    @restaurant = Restaurant.new
  end

  def create
    @restaurant = Restaurant.new(restaurant_params)
    if @restaurant.save
      redirect_to restaurants_path, notice: 'Restaurant was successfully created.'
    else
      render :new
    end
  end

  def show
   # No additional code needed as we already have the @restaurant object from the before_action callback.
  end

  def edit
   # No additional code needed as we already have the @restaurant object from the before_action callback.
  end

  def update
    if @restaurant.update(restaurant_params)
      redirect_to restaurant_path(@restaurant), notice: 'Restaurant was successfully updated.'
    else
      render :edit
    end
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find_by(id: params[:id])
    redirect_to root_path, alert: "Restaurant not found." unless @restaurant
  end

  def restaurant_params
    params.require(:restaurant).permit(:user_id, :address_id, :name, :phone, :email, :price_range, :active)
  end
end