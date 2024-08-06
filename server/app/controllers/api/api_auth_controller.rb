module Api
  class ApiAuthController < ActionController::Base
    skip_before_action :verify_authenticity_token
    include ApiHelper

    def index
      data = JSON.parse(request.body.read)
      email = data["email"]
      password = data["password"]
      user = User.find_by(email: email)
      customer = Customer.find_by(user_id: user&.id)
      courier = Courier.find_by(user_id: user&.id)

      if user && user.valid_password?(password)
        render json: { success: true, user_id: user.id, customer_id: customer&.id, courier_id: courier&.id }
      else
        render json: { success: false }, status: :unauthorized
      end
    end

    # GET /api/account/:id
    # Only covers customer and courier types for now
    def get_account
      id = params[:id]
      user_type = params[:type]
      valid_types = ["customer", "courier"]

      return render_400_error("Type required") unless user_type.present?
      return render_422_error("Invalid type") unless user_type.in?(valid_types)

      user = User.find_by(id: id)
      return render_422_error("Invalid id") unless user

      primary_email = user&.email
      account = user.customer if user_type == valid_types[0]
      account = user.courier if user_type == valid_types[1]

      render json: {
        primary_email: primary_email,
        account_email: account&.email,
        account_phone: account&.phone
      }
    end

    # POST /api/account/:id
    # Currently only covers customer and courier types
    def update_account
      id = params[:id]
      data = JSON.parse(request.body.read)
      valid_types = ["customer", "courier"]

      account_type = data["account_type"]
      return render_400_error("Account type required") unless account_type.present?
      return render_422_error("Invalid account type") unless account_type.in?(valid_types)

      user = User.find_by(id: id)
      return render_422_error("Invalid user id") unless user

      account = user.customer if account_type == valid_types[0]
      account = user.courier if account_type == valid_types[1]
      return render_422_error("Invalid account id") unless account

      account_phone = data["account_phone"]
      if account_phone&.strip&.empty?
        return render_400_error("Account phone cannot be blank")
      end

      account_email = data["account_email"]
      account_updates = {}
      account_updates[:email] = account_email if account_email.present?
      account_updates[:phone] = account_phone if account_phone.present?
      account.update(account_updates) unless account_updates.empty?

      redirect_to "/api/account/#{id}?type=#{account_type}"
    end

  end
end