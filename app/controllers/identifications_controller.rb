class IdentificationsController < ApplicationController

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

  def new
    @identification = Identification.new
    @photo = Photo.order("RAND()").first
    animal = @photo.animal

    # Get the 'wrong' animals from the two_similar_animals function
    wrong_animals = animal.two_similar_animals

    # Create array of ids and shortened names for choice buttons and shuffle
    @animals = [{ id: animal.id, name: animal.shortened_name }]
    wrong_animals.each { |el| @animals.push({id: el.id, name: el.shortened_name }) }
    @animals = @animals.shuffle

    respond_to do |format|
      format.html { render new_identification_path }
      format.js
    end
  end
end

  private
    def selection_params
      params.require(:identification)
        .permit(:photo_id, :user_identification,
          :correct_identification, :user_id)
    end
