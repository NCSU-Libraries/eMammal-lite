class RenameIdentificationsToIdentifications < ActiveRecord::Migration[5.0]
  def change
    rename_table :identifications, :identifications
  end
end
