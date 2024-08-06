class AddressesController < ApplicationController
  before_action :require_authentication
  before_action :set_address, only: [:show, :edit, :update, :destroy]

  def index
    @addresses = Address.all
  end

  def new
    @address = Address.new
  end

  def create
    @address = Address.new(address_params)
    if @address.save
      redirect_to addresses_path, notice: 'Address was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @address object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @address object from the before_action callback.
  end

  def update
    if @address.update(address_params)
      redirect_to address_path(@address), notice: 'Address was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @address = Address.find_by(id: params[:id])
    @address.destroy
    redirect_to addresses_path, notice: 'Address was successfully deleted.'
  end

  private

  def set_address
    @address = Address.find_by(id: params[:id])
    redirect_to root_path, alert: "Address not found." unless @address
  end

  def address_params
    params.require(:address).permit(:street_address, :city, :postal_code)
  end
end
