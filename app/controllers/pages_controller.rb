class PagesController < ApplicationController
  def home
  end

  def learn_more
  end

  # View for identifiying animals
  def identify
    # Use photos_helper to grab a random photo and associated information
    generate_random_photo_and_info
  end
end
