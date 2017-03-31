class ImmersionController < ApplicationController
  def index
    @project = Project.first
    get_topojson
  end

  def new_project_data
    # Get a random project and take only necessary data
    @project = Project.offset(rand(Project.count)).first
    # @project = Project.find(8)
    @project_reduced = {
      lat: @project.lat,
      lon: @project.lon,
      name: @project.name,
      description: @project.description
    }
    # Get all the associated photos from that project and necessary photo data
    @photos = @project.photos.sample(8).pluck(:id, :animal_id, :source)
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

  def current_global_stats
    get_top_five
    get_global_accuracy
    get_global_top_tags

    respond_to do |format|
      format.json { render json: [@top_five, @global_accuracy, @global_top_tags] }
    end
  end
end

  private
    def get_topojson
      gon.map = JSON.parse(File.read('app/assets/javascripts/world-simp.geojson'))
    end

    def get_top_five
      sorted_scores = User.where("email LIKE ?", '%ncsu.edu%').joins(:identifications)
        .where("correct_identification = true")
        .group("id").count.sort_by{ |k, v| -v }

      @top_five = sorted_scores.take(5)
        .map{ |v| {
          name: User.find(v[0]).name,
          icon: User.find(v[0]).animal_icon,
          score: v[1]
        }}
    end

    def get_global_accuracy
      correct = Identification.where("correct_identification = true").count
      total = Identification.where("user_identification IS NOT NULL").count
      @global_accuracy = {correct: correct, attempts: total}
    end

    def get_global_top_tags
      topAnimals = Identification
        .where("correct_identification = true")
        .group("user_identification")
        .count.sort_by{ |k, v| -v }[0..2]

      @global_top_tags = topAnimals.map{ |k,v| {
          name: Animal.find(k).name, tags: v
        }}
    end
