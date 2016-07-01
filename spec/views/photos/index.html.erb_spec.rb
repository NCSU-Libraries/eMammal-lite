require 'rails_helper'

RSpec.describe "photos/index", type: :view do
  before(:each) do
    assign(:photos, [
      Photo.create!(
        :animal => "Animal",
        :source => "Source"
      ),
      Photo.create!(
        :animal => "Animal",
        :source => "Source"
      )
    ])
  end

  it "renders a list of photos" do
    render
    assert_select "tr>td", :text => "Animal".to_s, :count => 2
    assert_select "tr>td", :text => "Source".to_s, :count => 2
  end
end
