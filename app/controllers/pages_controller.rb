class PagesController < ApplicationController
  def home
  end

  def about
  end

  def identify
    @photo = random_photo
  end
end
