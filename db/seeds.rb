# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
photo_id = {
  Coyote: "d19515s40i5",
  Puma: "d19460s14i3",
  White_tailed_Deer: "d19492s3i31",
  American_Black_Bear: "d17682s66i23"
}

photo_id.each do |animal, id|
  Photo.create!(
    animal: animal,
    source: "https://s3.amazonaws.com/emammalphoto/#{id}_o.jpg"
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
