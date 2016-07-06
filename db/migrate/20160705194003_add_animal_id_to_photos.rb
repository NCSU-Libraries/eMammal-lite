class AddAnimalIdToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :animal_id, :integer
  end
end
