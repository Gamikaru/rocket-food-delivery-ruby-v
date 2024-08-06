class ApplicationController < ActionController::Base
  # primary_abstract_class

  private

  def require_authentication
    redirect_to user_session_path unless user_signed_in?
  end
end
