# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require "csv"

# Create arrays to hold animals or projects on each run
animals = []
projects = []
CSV.foreach("db/seeds/FinalData.csv", {:headers => true}) do |row|
  # Create a photo entry for each row
  Photo.create!(
    source: row[0],
    animal_id: row[1],
    project_id: row[2]
  )

  # Only create an animal entry if the animal is not in the animals array
  # i.e., we only need unique animals
  if !animals.include?(row[3]) then
    Animal.create!(
      name: row[3],
      sci_name: row[4],
      animal_group: row[5]
    )
  end
  # Add animal to animals array to test if future animals are duplicates
  animals << row[3]

  # Only create a project entry if the project is not in the projects array
  # i.e., we only need unique projects
  if !projects.include?(row[6]) then
    Project.create!(
      name: row[6]
    )
  end
  # Add project to projects array to test if future projects are duplicates
  projects << row[6]
end
