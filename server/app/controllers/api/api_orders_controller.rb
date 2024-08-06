require 'twilio-ruby'

module Api
  class ApiOrdersController < ActionController::Base
    skip_before_action :verify_authenticity_token
    include ApiHelper

    # GET /api/orders
    def index
      # @orders = Order.all

        user_type = params[:type]
        id = params[:id]

        # Parameters validation
        unless user_type.present? && id.present?
          return render_400_error("Both 'user type' and 'id' parameters are required")
        end

        unless user_type.in?(%w[customer restaurant courier])
          return render_422_error("Invalid user type")
        end

        # Success responses
        orders = Order.user_orders(user_type, id)
        render json: orders.map(&method(:format_order_long)), status: :ok
      end

    # POST /api/orders
    def create
      restaurant_id, customer_id, products = params.values_at(:restaurant_id, :customer_id, :products)

      # Validate required parameters
      unless restaurant_id.present? && customer_id.present? && products.present?
        return render_400_error("Restaurant ID, customer ID, and products are required")
      end

      restaurant = Restaurant.find_by(id: restaurant_id)
      customer = Customer.find_by(id: customer_id)

      # Validate foreign keys exists
      unless restaurant && customer
        return render_422_error("Invalid restaurant or customer ID")
      end

      order = Order.create!(restaurant_id: restaurant_id, customer_id: customer_id, order_status_id: OrderStatus.find_by(name: "pending")&.id)

      # Validate order
      unless order
        return render_422_error("Failed to create order")
      end

      # Validate and create product orders
      products.each do |product_params|
        product = Product.find_by(id: product_params[:id])

        unless product
          order.destroy
          return render_422_error("Invalid product ID")
        end

        order.product_orders.create!(product_id: product.id, product_quantity: product_params[:quantity].to_i, product_unit_cost: product.cost)
      end

      # If sms parameters, use method to send sms confirmation
      if params[:send_sms] == true
        customer_phone_number = order.customer.phone
        restaurant_phone_number = ENV['TWILIO_PHONE_NUMBER']
        send_sms_notification(customer_phone_number, "Your order has been confirmed!")
        # send_sms_notification(restaurant_phone_number, "You have a new order!")
      end

      # If email parameters, use method to send email confirmation
      if params[:send_email] == true
        customer_email = order.customer.email
        send_notify_email(customer_email, order)
      end

      render json: format_order_long(order), status: :created
    end

    # POST /api/order/:id/status
    def set_status
      status = params[:status]
      id = params[:id]

      unless status.present? && status.in?(["pending", "in progress", "delivered"])
        return render_422_error("Invalid status")
      end

      order = Order.find_by(id: id)
      unless order
        return render_422_error("Invalid order")
      end

      order.update(order_status_id: OrderStatus.find_by(name: status)&.id)
      render json: { status: order.order_status.name }, status: :ok
    end

    # POST /api/order/:id/rating
    def set_rating
      rating = params[:restaurant_rating]
      id = params[:id]

      puts "id: ", id
      puts "rating: ", rating

      order = Order.find_by(id: id)
      return render_422_error("Invalid order") unless order
      return render_400_error("Restaurant rating required") unless rating.present?
      return render_422_error("Invalid rating") unless rating.between?(1,5)

      order.update(restaurant_rating: rating)
      render json: { restaurant_rating: rating }, status: :ok
    end

    private

    # Method to send sms confirmation
    def send_sms_notification(phone_number, message)
      account_sid = ENV['TWILIO_ACCOUNT_SID']
      auth_token = ENV['TWILIO_AUTH_TOKEN']
      client = Twilio::REST::Client.new(account_sid, auth_token)

      client.messages.create(
        body: message,
        from: ENV['TWILIO_PHONE_NUMBER'],
        to: phone_number
      )
    end

    # Method to send email confirmation
    def send_notify_email(email, order)
      notify_secret_key = ENV['NOTIFY_SECRET_KEY']
      notify_client_id = ENV['NOTIFY_CLIENT_ID']
      notify_template_id = ENV['NOTIFY_TEMPLATE_ID']

      url = "https://api.notify.eu/notification/send"

      headers = {
        'Content-Type' => 'application/json',
        'X-ClientId' => notify_client_id,
        'X-SecretKey' => notify_secret_key
      }

      payload = {
        message: {
          notificationType: notify_template_id,
          language: "en",
          params: {
            order_id: order.id,
            customer_name: order.customer&.user&.name,
            restaurant_name: order.restaurant.name,
            order_total_cost: format_cents_to_currency(order.total_cost),
          },
          transport: [
            {
              type: "SMTP",
              recipients: {
                to: [
                  {
                    name: order.customer&.user&.name,
                    recipient: email
                  }
                ]
              },
            }
          ]
        }
      }

      response = HTTParty.post(url, headers: headers, body: payload.to_json)

      # Handle the Notify.eu response as needed
      if response.success?
        puts "Email notification sent"
        nil
      else
        render_422_error("Failed to send email notification")
      end
    end

    # Currency Formatter
    def format_cents_to_currency(cents)
      amount_in_dollars = cents.to_f / 100
      sprintf("$%.2f", amount_in_dollars)
    end

    # Formats an order to its long form, in json
    def format_order_long(order)
      {
        id: order.id,
        customer_id: order.customer.id,
        customer_name: order.customer.user.name,
        customer_address: order.customer.address.full_address,
        customer_phone: order.customer.phone,
        customer_name: order.customer&.user&.name,
        customer_email: order.customer.email,
        restaurant_id: order.restaurant.id,
        restaurant_name: order.restaurant.name,
        restaurant_address: order.restaurant.address.full_address,
        restaurant_phone: order.restaurant.phone,
        courier_id: order.courier&.id,
        courier_name: order.courier&.user&.name,
        status: order.order_status.name,
        products: order.product_orders.map do |po|
          {
            product_id: po.product.id,
            product_name: po.product.name,
            quantity: po.product_quantity,
            unit_cost: po.product_unit_cost,
            total_cost: po.product_quantity * po.product_unit_cost
          }
        end,
        total_cost: order.total_cost,
        created_at: order.created_at,
        updated_at: order.updated_at,
      }
    end

  end
end