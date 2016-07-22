class Photo < ActiveRecord::Base
  belongs_to :animal
  has_many :identifications

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
