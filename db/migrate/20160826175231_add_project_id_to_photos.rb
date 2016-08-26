class AddProjectIdToPhotos < ActiveRecord::Migration[5.0]
  def change
    add_column :photos, :project_id, :integer
    add_index :photos, :project_id
  end
end
