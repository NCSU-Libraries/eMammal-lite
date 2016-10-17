class RenameResponsesToIdentifications < ActiveRecord::Migration[5.0]
  def change
    rename_table :responses, :identifications
  end
end
