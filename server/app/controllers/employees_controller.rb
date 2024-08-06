class EmployeesController < ApplicationController
  before_action :require_authentication
  before_action :set_employee, only: [:show, :edit, :update, :destroy]

  def index
    @employees = Employee.all
  end

  def new
    @employee = Employee.new
  end

  def create
    @employee = Employee.new(employee_params)
    if @employee.save
      redirect_to employees_path, notice: 'Employee was successfully created.'
    else
      render :new
    end
  end

  def show
    # No additional code needed as we already have the @employee object from the before_action callback.
  end

  def edit
    # No additional code needed as we already have the @employee object from the before_action callback.
  end

  def update
    if @employee.update(employee_params)
      redirect_to employee_path(@employee), notice: 'Employee was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @employee = Employee.find_by(id: params[:id])
    @employee.destroy
    redirect_to employees_path, notice: 'Employee was successfully deleted.'
  end

  private

  def set_employee
    @employee = Employee.find_by(id: params[:id])
    redirect_to root_path, alert: "Employee not found." unless @employee
  end

  def employee_params
    params.require(:employee).permit(:user_id, :address_id, :phone, :email)
  end
end
