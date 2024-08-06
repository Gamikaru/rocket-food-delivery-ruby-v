class Customer < ApplicationRecord
  belongs_to :user
  belongs_to :address
  has_many :orders

  validates :user_id, presence: true, uniqueness: true
  validates :address_id, :phone, :active, presence: true
end
