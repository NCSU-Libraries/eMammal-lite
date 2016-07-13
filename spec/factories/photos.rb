photo_id = ["d19515s40i5", "d19460s14i3", "d19492s3i31", "d17682s66i23", "d16982s30i3", "d19658s62i5"]

FactoryGirl.define do
  factory :photo do
    animal_id 1
    sequence :source do |n|
      photo_id[n]
    end
  end

end
