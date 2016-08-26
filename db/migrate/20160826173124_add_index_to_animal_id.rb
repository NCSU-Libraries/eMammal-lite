class AddIndexToAnimalId < ActiveRecord::Migration[5.0]
  def change
    add_index :photos, :animal_id
  end
end
