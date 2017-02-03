class Identification < ApplicationRecord
  before_save :set_correct_identification

  belongs_to :photo
  belongs_to :user
  # has_one :animal, through: :photo
  has_one :animal, primary_key: :user_identification, foreign_key: :animal_id

  scope :correct_identification, -> { where(correct_identification: true) }

  private
    # Set boolean for correct identification and THEN return nil
    def set_correct_identification
      self.correct_identification = self.user_identification == self.photo.animal.id
      return
    end
end
