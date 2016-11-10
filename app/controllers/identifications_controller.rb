class IdentificationsController < ApplicationController
  before_action :check_for_skip, only: [:new]

  def new
    @identification = Identification.new
    @photo = Photo.find_by_id(session[:last_photo]) ||
      Photo.order("RAND()").first

    # Get the 'wrong' animals from the two_similar_animals function
    getSimilarAnimals

    session[:last_photo] = @photo.id
    respond_to do |format|
      format.html { render new_identification_path }
      format.js
    end
  end

  # Take user identification information and create row in database
  def create
    @identification = Identification.new(selection_params)
    @identification.save
    # If user skips id generate new photo and animal and proceed to next card

    respond_to do |format|
      format.html { redirect_to new_identification_path }
      format.js
    end
  end

  def index
  end
end

  private
    def selection_params
      params.require(:identification)
        .permit(:photo_id, :user_identification,
          :correct_identification, :user_id)
    end

    def check_for_skip
        session.delete(:last_photo) if request.format.symbol == :js
    end

    def remove_last_photo
      session.delete(:last_photo)
    end

    def getSimilarAnimals
      animal = @photo.animal
      wrong_animals = animal.two_similar_animals

      # Create array of ids and shortened names for choice buttons and shuffle
      @animals = [{ id: animal.id, name: animal.shortened_name }]
      wrong_animals.each { |el| @animals.push({id: el.id, name: el.shortened_name }) }
      @animals = @animals.shuffle
    end
