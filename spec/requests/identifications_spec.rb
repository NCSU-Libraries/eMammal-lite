require 'rails_helper'

RSpec.describe "Identifications", type: :request do
  describe "with user taging a photo" do

    before(:all) do
      @photo = FactoryGirl.create(:photo)
      @animals = FactoryGirl.create_list(:animal, 3)
      @photo_animal = @photo.animal
      FactoryGirl.create(:identification)
    end

    it "correctly identifies animal" do
      before_count = Identification.count
      # Params with correct identification
      post identifications_path, identification: {
        photo_id: @photo.id,
        user_id: 1,
        user_identification: @photo_animal.id
      }
      expect(Identification.count).to eq(before_count + 1)
      expect(Identification.first.correct_identification).to be true
    end

    it "incorrectly identifies animal" do
      before_count = Identification.count
      # Params with incorrect identification
      post identifications_path, identification: {
        photo_id: @photo.id,
        user_id: 1,
        user_identification: 0
      }
      expect(Identification.count).to eq(before_count + 1)
      expect(Identification.first.correct_identification).to be false
    end
  end
end
