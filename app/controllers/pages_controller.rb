class PagesController < ApplicationController
  def home
  end

  def about
  end

  # View for identifiying animals
  def identify
    # Select a random photo from the photos database
    @photo = Photo.order("RAND()").first

    # Get the correct animal from the photo and remove any underscores in the name
    @animals = []
    animal = @photo.animal
    @animals.push({id: animal.id, name: animal.name })

    wrong_animals = Animal.where(animal_group: animal.animal_group).where.not(id: animal.id).order("RAND()").limit(2)
    wrong_animals.each { |el| @animals.push({id: el.id, name: el.name }) }

    @animals = @animals.shuffle

    @animals.each do |el|
      if el[:name].include?("_")
        el[:name].name.tr!("_", " ")
      end
    end

    @identification = Identification.new
  end
end
