class AddIconToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :animal_icon, :string
  end
end
