class OrdersController < ApplicationController
  # before_action :require_authentication
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  def index
    @orders = Order.all
  end

  def new
    @order = Order.new
  end

  # POST /api/orders
  def create
    @order = Order.new(order_params)
    if @order.save
      redirect_to orders_path, notice: 'Order was successfully created.'
    else
      render :new
    end
  end

  def show
   # No additional code needed as we already have the @order object from the before_action callback.
  end

  def edit
   # No additional code needed as we already have the @order object from the before_action callback.
  end

  def update
    if @order.update(order_params)
      redirect_to order_path(@order), notice: 'Order was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @order = Order.find_by(id: params[:id])
    @order.destroy
    redirect_to orders_path, notice: 'Order was successfully deleted.'
  end

  def order_params
    params.require(:order).permit(:restaurant_id, :customer_id, :order_status_id, :restaurant_rating)
  end

  private

  def set_order
    @order = Order.find_by(id: params[:id])
    redirect_to root_path, alert: "Order not found." unless @order
  end
end