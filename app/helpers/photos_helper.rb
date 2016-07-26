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

    animal_name_edit

    @identification = Identification.new
  end


  def animal_name_edit
    @animals.each do |el|
      # Some names have underscores, so remove them if necessary
      if el[:name].include?("_")
        el[:name].tr!("_", " ")
      end

      # To shorten names, replace names with direction adverbs with abbreviation
      el[:name].sub!("Northern", "N.")
      el[:name].sub!("Eastern", "E.")
      el[:name].sub!("Soutern", "S.")
      el[:name].sub!("Western", "W.")

      # Shorten place adverbs
      el[:name].sub!("American", "Am.")
      el[:name].sub!("African", "Af.")

      # Remove 'Unkown' and other weird adverbs from any names
      el[:name].sub!("Unknown", "")
      el[:name].sub!("Crab-eating", "")
    end
  end
end
