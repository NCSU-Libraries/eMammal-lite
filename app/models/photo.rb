class Photo < ActiveRecord::Base
  belongs_to :animal
  # Find the animal in the picture
  # def animal_info
  #   Animal.find_by("id": :animal_id)
  # end

  def random_photo
    @photo.order("RAND()").first
  end
end
