class IdentificationsController < ApplicationController

  # Take user identification information and create row in database
  def create
    @identification = Identification.new(selection_params)
    @identification.save

    # If user skips id generate new photo and animal and proceed to next card
    if @identification.user_identification.nil?
      generate_random_photo_and_info
      render :template => 'identifications/next_card'
    end

    respond_to do |format|
      format.html { redirect_to identify_path }
      format.js
    end
  end

  # Generate a new image and animal names and produce new card
  def next_card
    # Use photos_helper to grab a random photo and associated information
    generate_random_photo_and_info

    respond_to do |format|
      format.html { redirect_to identify_path }
      format.js
    end
  end
end

  private
    def selection_params
      params.require(:identification)
        .permit(:photo_id, :user_identification, :correct_identification, :user_id)
    end
