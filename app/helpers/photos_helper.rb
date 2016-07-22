module PhotosHelper
  def generate_random_photo_and_info
    @photo = Photo.order("RAND()").first

    # Get the correct animal from the photo and create an array to store animal ids and names
    animal = @photo.animal

    # Get the 'wrong' animals from the two_similar_animals function
    wrong_animals = animal.two_similar_animals

    # Create array of ids and names for choice buttons and shuffle
    @animals = [{ id: animal.id, name: animal.name }]
    wrong_animals.each { |el| @animals.push({id: el.id, name: el.name }) }
    @animals = @animals.shuffle

    # Some names have underscores, so remove them if necessary
    @animals.each do |el|
      if el[:name].include?("_")
        el[:name].tr!("_", " ")
      end
    end

    @identification = Identification.new
  end
end
