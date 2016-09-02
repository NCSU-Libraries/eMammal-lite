class AddAnimalIdToAnimals < ActiveRecord::Migration[5.0]
  def change
    add_column :animals, :animal_id, :integer
    add_index :animals, :animal_id
  end
end
