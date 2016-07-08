require 'rails_helper'

RSpec.describe "Identifications", type: :request do
  describe "user identifying photos" do
    it "renders Identify page and posts response" do
      get identify_path
      expect(response).to render_template('pages/identify')

      # Good params
      post identifications_path, identification: {
        photo_id: 1,
        user_id: 1,
        user_identification: 1
      }
      expect(response).to have_http_status(200)
    end
  end
end
