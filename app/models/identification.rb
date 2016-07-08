class Identification < ApplicationRecord
  before_save :set_correct_identification

  belongs_to :photo
  # has_one :animal, through: :photo
  belongs_to :animal

  private
    def set_correct_identification
      self.correct_identification = self.user_identification == self.photo.animal.id
    end
end
