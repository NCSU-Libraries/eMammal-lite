# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require "csv"

CSV.foreach("db/seeds/photoInfo.csv", {:headers => true}) do |row|
  Photo.create!(
    animal_id: row[0],
    source: row[1]
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
