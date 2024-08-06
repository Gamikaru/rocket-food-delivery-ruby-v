class ProductsController < ApplicationController
  # before_action :require_authentication
  before_action :set_product, only: [:show, :edit, :update, :destroy]

  def index
    @products = Product.all
  end

  def new
    @product = Product.new
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to products_path, notice: 'Product was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @product object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @product object from the before_action callback.
  end

  def update
    if @product.update(product_params)
      redirect_to product_path(@product), notice: 'Product was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @product = Product.find_by(id: params[:id])
    @product.destroy
    redirect_to products_path, notice: 'Product was successfully deleted.'
  end

  private

  def set_product
    @product = Product.find_by(id: params[:id])
    redirect_to root_path, alert: "Product not found." unless @product
  end

  def product_params
    params.require(:product).permit(:restaurant_id, :name, :description, :cost, :price_range)
  end
end