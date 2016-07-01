module PhotosHelper
  def random_photo
    Photo.limit(1).order("RAND()").first
  end
end
