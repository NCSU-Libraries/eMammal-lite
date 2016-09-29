class IdentificationsController < ApplicationController

  def new
    if user_signed_in?
      @identification = Identification.new
      @photo = Photo.find_by_id(session[:last_photo]) ||
        Photo.order("RAND()").first
      session[:last_photo] = @photo.id

      # Get the 'wrong' animals from the two_similar_animals function
      getSimilarAnimals

      respond_to do |format|
        format.html { render new_identification_path }
        format.js
      end
    else
      redirect_to new_user_session_path
    end
  end

  # Take user identification information and create row in database
  def create
    @identification = Identification.new(selection_params)
    @identification.save
    session.delete(:last_photo)
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

    def getSimilarAnimals
      animal = @photo.animal
      wrong_animals = animal.two_similar_animals

      # Create array of ids and shortened names for choice buttons and shuffle
      @animals = [{ id: animal.id, name: animal.shortened_name }]
      wrong_animals.each { |el| @animals.push({id: el.id, name: el.shortened_name }) }
      @animals = @animals.shuffle
    end
