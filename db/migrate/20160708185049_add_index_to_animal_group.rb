class AddIndexToAnimalGroup < ActiveRecord::Migration[5.0]
  def change
    add_index :animals, :animal_group
  end
end
