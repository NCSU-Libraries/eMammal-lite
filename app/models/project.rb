class Project < ApplicationRecord
  has_many :photos
  has_many :animals, through: :photos
end
