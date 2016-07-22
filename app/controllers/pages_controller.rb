class PagesController < ApplicationController
  def home
  end

  def about
  end

  # View for identifiying animals
  def identify
    # Use photos_helper to grab a random photo and associated information
    generate_random_photo_and_info
  end
end
