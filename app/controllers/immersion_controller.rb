class ImmersionController < ApplicationController
  def index
    @photos = Photo.first
  end
end
