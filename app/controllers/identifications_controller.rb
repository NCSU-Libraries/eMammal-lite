class IdentificationsController < ApplicationController

  def create
    @identification = Identification.new(selection_params)
    @identification.save

    # Use photos_helper to grab a random photo and associated information
    # generate_random_photo_and_info

    respond_to do |format|
      format.html { redirect_to identify_path }
      format.js
    end
  end

  def next_card
    # Use photos_helper to grab a random photo and associated information
    generate_random_photo_and_info

    respond_to do |format|
      format.js
    end
  end
end

  private
    def selection_params
      params.require(:identification)
        .permit(:photo_id, :user_identification, :correct_identification, :user_id)
    end
