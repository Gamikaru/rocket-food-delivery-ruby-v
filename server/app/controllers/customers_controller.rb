class CustomersController < ApplicationController
  before_action :require_authentication
  before_action :set_customer, only: [:show, :edit, :update, :destroy]

  def index
    @customers = Customer.all
  end

  def new
    @customer = Customer.new
  end

  def create
    @customer = Customer.new(customer_params)
    if @customer.save
      redirect_to customers_path, notice: 'Customer was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @customer object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @customer object from the before_action callback.
  end

  def update
    if @customer.update(customer_params)
      redirect_to customer_path(@customer), notice: 'Customer was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @customer = Customer.find_by(id: params[:id])
    @customer.destroy
    redirect_to customers_path, notice: 'Customer was successfully deleted.'
  end

  private

  def set_customer
    @customer = Customer.find_by(id: params[:id])
    redirect_to root_path, alert: "Customer not found." unless @customer
  end

  def customer_params
    params.require(:customer).permit(:user_id, :address_id, :phone, :email, :active)
  end
end
