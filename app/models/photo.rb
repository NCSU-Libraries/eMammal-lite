class Photo < ActiveRecord::Base
  belongs_to :animal, foreign_key: :animal_id
  belongs_to :project, foreign_key: :project_id
  has_many :identifications

  def self.search(search_query)
    if !search_query.blank?
      animal_names = Animal.distinct.pluck(:name)
      animal_words = Animal.distinct.pluck(:name).join(" ").split(" ")
      fuzzy_names = FuzzyMatch.new(animal_names.concat(animal_words))
      fuzzy_search = fuzzy_names.find(search_query)
      puts  fuzzy_search
      joins(:animal).where("name LIKE ?", "%#{fuzzy_search}%")
    else
      first(15)
    end
  end

  def photoExists?
    uri = URI("https://s3.amazonaws.com/emammalphoto/#{self.source}_o.jpg")
    Net::HTTP.get_response(uri).response.code.to_i < 300
  end

  # Return the stats for a photo
  def stats
    total_ids = self.identifications
    {
      :correct => total_ids.where("correct_identification = ?", true).count,
      :incorrect => total_ids.where("correct_identification = ?", false).count,
      :skipped => total_ids.where("correct_identification = ?", nil).count,
      :total => total_ids.count
    }
  end
end
