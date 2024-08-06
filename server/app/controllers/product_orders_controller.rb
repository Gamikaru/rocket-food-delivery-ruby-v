class ProductOrdersController < ApplicationController
  before_action :require_authentication
  before_action :set_product_order, only: [:show, :edit, :update, :destroy]

  def index
    @product_orders = ProductOrder.all
  end

  def new
    @product_order = ProductOrder.new
  end

  def create
    @product_order = ProductOrder.new(product_order_params)
    if @product_order.save
      redirect_to product_orders_path, notice: 'Product order was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @product_order object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @product_order object from the before_action callback.
  end

  def update
    if @product_order.update(product_order_params)
      redirect_to product_order_path(@product_order), notice: 'Product order was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @product_order = ProductOrder.find_by(id: params[:id])
    @product_order.destroy
    redirect_to product_orders_path, notice: 'Product order was successfully deleted.'
  end

  private

  def set_product_order
    @product_order = ProductOrder.find_by(id: params[:id])
    redirect_to root_path, alert: "Product Order not found." unless @product_order
  end

  def product_order_params
    params.require(:product_order).permit(:product_id, :order_id, :product_quantity, :product_unit_cost)
  end
end
