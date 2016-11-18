class IdentificationsController < ApplicationController
  before_action :check_for_skip, only: [:new]

  def new
    @identification = Identification.new
    @photo = get_random_not_identified_photo
    gon.map = JSON.parse(File.read('app/assets/javascripts/world.geojson'))

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
    get_top_five_and_user_score
    get_global_top_tags
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

    def get_top_five_and_user_score
      sorted_scores = User.joins(:identifications)
        .where("correct_identification = true")
        .group("id").count.sort_by{|k,v| -v}.to_h

      @top_five = sorted_scores.take(5).to_h

      if !@top_five.keys.include?(User.first.id)
        @user_rank = sorted_scores.keys.find_index(current_or_guest_user.id) + 1
      end

      return @top_five, @user_rank
    end

    def get_global_top_tags
      topAnimals = Identification
        .where("correct_identification = true")
        .group("user_identification")
        .count.sort_by{|k,v| -v}[0..2]

      @global_top_tags = topAnimals.map{|key,val| [Animal.find(key).name, val]}.to_h

    end
