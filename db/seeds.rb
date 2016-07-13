# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require "csv"

photo_id = {
  "Coyote": "d19515s40i5",
  "Puma": "d19460s14i3",
  "White-tailed Deer": "d19492s3i31",
  "American Black Bear": "d17682s66i23",
  "Bobcat": "d16982s30i3",
  "Grey Fox": "d19658s62i5"
}

photo_id.each.with_index do |(animal, id), index|
  Photo.create!(
    animal_id: index + 1,
    source: id
  )
end

animals_text = File.read("db/seeds/animals.csv")
csv = CSV.parse(animals_text)

csv[0].each do |animal|
  Animal.create!(
    name: animal,
    sci_name: animal.to_s + " rex",
    animal_group: rand(1..6)
  )
end

# Photo.create!(
#   animal: "Coyote",
#   source: "https://s3.amazonaws.com/emammalphoto/d19515s40i5_o.jpg"
# )
#
# Photo.create!(
#   animal: "Coyote",
#   source: "https://s3.amazonaws.com/emammalphoto/d19460s14i3_o.jpg"
# )
