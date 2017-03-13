class ImmersionController < ApplicationController
  def index
    @project = Project.first
    get_topojson
  end

  def new_project_data
    @project = Project.order("RAND()").first

    respond_to do |format|
      format.json { render json: @project }
    end
  end
end

  private
    def get_topojson
      gon.map = JSON.parse(File.read('app/assets/javascripts/world-simp.geojson'))
    end
