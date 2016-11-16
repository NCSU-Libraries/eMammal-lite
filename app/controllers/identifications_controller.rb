class IdentificationsController < ApplicationController
  before_action :check_for_skip, only: [:new]

  def new
    @identification = Identification.new
    @photo = get_random_not_identified_photo
    gon.map = JSON.parse(File.read('app/assets/javascripts/world.geojson'))
    @coords = [@photo.project.lat, @photo.project.lon]

    # Get the 'wrong' animals from the two_similar_animals function
    get_similar_animals

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

    # Remove the last photo from the session since it has been identified
    remove_last_photo

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

    def get_random_not_identified_photo
      has_identified = current_or_guest_user.identifications
        .where("correct_identification = true").pluck("photo_id")
      Photo.where.not(id: has_identified).find_by_id(session[:last_photo]) ||
        Photo.order("RAND()").first
    end

    def get_similar_animals
      animal = @photo.animal
      wrong_animals = animal.two_similar_animals

      # Create array of ids and shortened names for choice buttons and shuffle
      @animals = [{ id: animal.id, name: animal.shortened_name }]
      wrong_animals.each { |el| @animals.push({id: el.id, name: el.shortened_name }) }
      @animals = @animals.shuffle
    end

    def check_for_skip
        session.delete(:last_photo) if request.format.symbol == :js
    end

    def remove_last_photo
      session.delete(:last_photo)
    end
