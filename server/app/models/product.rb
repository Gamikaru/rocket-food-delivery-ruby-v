class Product < ApplicationRecord
  belongs_to :restaurant
  has_many :product_orders

  validates :restaurant_id, :name, presence: true
  validates :cost, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :select_short, -> { select(:id, :name, :cost) }
end
