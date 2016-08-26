class Photo < ActiveRecord::Base
  belongs_to :animal
  belongs_to :project
  has_many :identifications

  def self.search(search_query)
    if !search_query.blank?
        joins(:animal).where("name = ?", "#{search_query}")
    else
      first(15)
    end
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
