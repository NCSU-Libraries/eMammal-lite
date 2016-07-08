class CreateResponses < ActiveRecord::Migration[5.0]
  def change
    create_table :responses do |t|
      t.integer :photo_id
      t.integer :identification
      t.boolean :correct_identification
      t.integer :user_id

      t.timestamps
    end
    add_index :responses, :photo_id
    add_index :responses, :user_id
  end
end
