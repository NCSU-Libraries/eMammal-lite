class AddColumnsToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :lat, :float
    add_column :projects, :lon, :float
  end
end
