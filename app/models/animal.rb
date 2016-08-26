class Animal < ActiveRecord::Base
  has_many :photos
  has_many :projects, through: :photos
  has_many :identifications, foreign_key: :user_identification

  # Returns two animals that are similar to the current animal
  def two_similar_animals
    Animal.where(animal_group: self.animal_group)
      .where.not(id: self.id)
      .order("RAND()").limit(2)
  end
end
