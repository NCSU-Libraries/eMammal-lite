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

  # Takes care of long names if needed to be shortened
  def shortened_name
    # Some names have underscores, so remove them if necessary
    if self.name.include?("_")
      self.name.tr!("_", " ")
    end

    # # To shorten names, replace names with direction adverbs with abbreviation
    self.name.sub!("Northern", "N.")
    self.name.sub!("Eastern", "E.")
    self.name.sub!("Soutern", "S.")
    self.name.sub!("Western", "W.")

    # Shorten place adverbs
    self.name.sub!("American", "Am.")
    self.name.sub!("African", "Af.")

    # Remove 'Unkown' and other weird adverbs from any names
    self.name.sub!("Unknown", "")
    self.name.sub!("Crab-eating", "")

    self.name
  end


end
