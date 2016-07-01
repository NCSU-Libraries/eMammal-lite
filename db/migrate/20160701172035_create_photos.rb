class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :animal
      t.string :source

      t.timestamps null: false
    end
  end
end
