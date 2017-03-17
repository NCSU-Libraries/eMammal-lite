class ImmersionController < ApplicationController
  def index
    @project = Project.first
    get_topojson
  end

  def new_project_data
    # Get a random project and take only necessary data
    @project = Project.offset(rand(Project.count)).first
    @project_reduced = {
      lat: @project.lat,
      lon: @project.lon,
      name: @project.name,
      description: @project.description
    }
    # Get all the associated photos from that project and necessary photo data
    @photos = @project.photos.sample(10).pluck(:id, :animal_id, :source)
      .map{ |v| {
        id: v[0],
        animal: Animal.find(v[1]).name,
        sci_name: Animal.find(v[1]).sci_name,
        stats: Photo.find(v[0]).stats,
        source: v[2] }}

    respond_to do |format|
      format.json { render json: [@project_reduced, @photos] }
    end
  end
end

  private
    def get_topojson
      gon.map = JSON.parse(File.read('app/assets/javascripts/world-simp.geojson'))
    end
