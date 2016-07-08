class Animal < ActiveRecord::Base
  has_many :photos
  has_many :identifications, foreign_key: :identification
end
