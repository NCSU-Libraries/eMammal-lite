class RemoveAnimalFromPhotos < ActiveRecord::Migration
  def change
    remove_column :photos, :animal, :string
  end
end
