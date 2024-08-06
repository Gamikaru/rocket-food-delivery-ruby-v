class OrderStatusesController < ApplicationController
  before_action :require_authentication
  before_action :set_order_status, only: [:show, :edit, :update, :destroy]

  def index
    @order_statuses = OrderStatus.all
  end

  def new
    @order_status = OrderStatus.new
  end

  def create
    @order_status = OrderStatus.new(order_status_params)
    if @order_status.save
      redirect_to order_statuses_path, notice: 'Order status was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @order_status object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @order_status object from the before_action callback.
  end

  def update
    if @order_status.update(order_status_params)
      redirect_to order_status_path(@order_status), notice: 'Order status was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @order_status = OrderStatus.find(params[:id])
    @order_status.destroy
    redirect_to order_statuses_path, notice: 'Order status was successfully deleted.'
  end

  private

  def set_order_status
    @order_status = OrderStatus.find(params[:id])
    redirect_to root_path, alert: "Order status not found." unless @order_status
  end

  def order_status_params
    params.require(:order_status).permit(:name)
  end
end
