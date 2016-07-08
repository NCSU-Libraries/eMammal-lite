class AddAnimalGroupToAnimals < ActiveRecord::Migration[5.0]
  def change
    add_column :animals, :animal_group, :integer
  end
end
