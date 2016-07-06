class PagesController < ApplicationController
  def home
  end

  def about
  end

  def identify
    @photo = Photo.first
  end
end
