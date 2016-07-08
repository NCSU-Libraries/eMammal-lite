class RenameColumns < ActiveRecord::Migration[5.0]
  def change
    rename_column :identifications, :identification, :user_identification
    add_index :animals, :name
  end
end
