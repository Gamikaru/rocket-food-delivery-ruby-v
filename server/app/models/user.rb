class User < ApplicationRecord
  has_one :employee
  has_one :customer
  has_many :restaurants
  has_one :courier

  validates :name, :email, :password, presence: true

  # Include default devise modules. Others available are:
  # :validatable module in Devise adds validations to the user model (typically called User) to ensure the validity of user attributes.  # :confirmable: Confirmable # Adds the ability to send confirmation emails to newly registered users and requires them to confirm their account before accessing the application.
  # :database_authenticatable: Database Authenticatable # Handles authentication based on a database table storing encrypted passwords.
  # :encryptable: Encryptable # Handles the encryption of passwords and other sensitive information stored in the database.
  # :lockable: Lockable # Adds functionality to lock user accounts after a specified number of failed sign-in attempts, preventing further sign-in until the account is unlocked.
  # :omniauthable: Omniauthable # Allows users to sign in with external providers (such as Facebook, Google, or Twitter) using OmniAuth.
  # :recoverable: Recoverable # Provides password reset functionality by allowing users to reset their forgotten passwords.
  # :registerable: Registerable # Enables user registration, including sign-up functionality.
  # :rememberable: Rememberable # Allows users to be remembered across browser sessions using a "remember me" functionality.
  # :timeoutable: Timeoutable # Automatically signs out users after a certain period of inactivity.
  # :trackable: Trackable # Tracks sign-in statistics such as the number of sign-ins, timestamps, and IP addresses.

  devise :database_authenticatable, :rememberable, :validatable

  # Checks if user is an employee when signing in. Automatically picked up by Rails
  def active_for_authentication?
    super && is_employee?
  end

  def is_employee?
    Employee.find_by(id: self.id)
  end
end