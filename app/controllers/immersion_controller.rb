class ImmersionController < ApplicationController
  def index
    @project = Project.first
    get_topojson
  end

  def new_project_data
    # Get a random project and take only necessary data
    @project = Project.order("RAND()").first
    @project_reduced = {
      lat: @project.lat,
      lon: @project.lon,
      name: @project.name
    }
    # Get all the associated photos from that project (only necessary data)
    @photos = @project.photos.pluck(:id, :animal_id, :source)
      .map{ |v| { id: v[0], animal_id: v[1], source: v[2] }}
    # Get all the associated animals from that project (only necessary data)
    @animals = @project.animals.uniq.pluck(:animal_id, :name, :sci_name)
      .map{ |v| { animal_id: v[0], name: v[1], sci_name: v[2] }}

    respond_to do |format|
      format.json { render json: [@project_reduced, @photos, @animals] }
    end
  end
end

  private
    def get_topojson
      gon.map = JSON.parse(File.read('app/assets/javascripts/world-simp.geojson'))
    end
