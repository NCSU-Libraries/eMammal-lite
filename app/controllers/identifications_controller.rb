class IdentificationsController < ApplicationController

  def create
    @identification = Identification.new(selection_params)
    @identification.save
  end
end

  private
    def selection_params
      params.require(:identification)
        .permit(:photo_id, :user_identification, :correct_identification, :user_id)
    end
