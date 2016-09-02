class AddProjectIdToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :project_id, :integer
    add_index :projects, :project_id
  end
end
