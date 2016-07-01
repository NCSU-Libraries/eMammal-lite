require 'rails_helper'

RSpec.describe "photos/new", type: :view do
  before(:each) do
    assign(:photo, Photo.new(
      :animal => "MyString",
      :source => "MyString"
    ))
  end

  it "renders new photo form" do
    render

    assert_select "form[action=?][method=?]", photos_path, "post" do

      assert_select "input#photo_animal[name=?]", "photo[animal]"

      assert_select "input#photo_source[name=?]", "photo[source]"
    end
  end
end
