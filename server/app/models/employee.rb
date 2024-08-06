class Employee < ApplicationRecord
  belongs_to :user
  belongs_to :address

  validates :user_id, presence: true, uniqueness: true
  validates :address_id, :phone, presence: true
end
