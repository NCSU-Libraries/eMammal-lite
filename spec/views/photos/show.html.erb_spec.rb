require 'rails_helper'

RSpec.describe "photos/show", type: :view do
  before(:each) do
    @photo = assign(:photo, Photo.create!(
      :animal => "Animal",
      :source => "Source"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Animal/)
    expect(rendered).to match(/Source/)
  end
end
