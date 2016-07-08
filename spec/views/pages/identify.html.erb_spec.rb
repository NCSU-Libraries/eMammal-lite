require 'rails_helper'

RSpec.describe "pages/identify.html.erb", type: :view do
  before :each do
    @photo = FactoryGirl.build(:photo)
    @identification = Identification.new
    @animal1 = FactoryGirl.build(:animal)
    @animal = @photo.animal
  end

  it "displays the identify page with loaded image" do
    render
    expect(rendered).to have_css("img[src*=#{@photo.source}]")
  end

  it "displays the correct name of the animal" do
    render
    expect(@animal.name).to eql(@animal1.name)
  end
end
