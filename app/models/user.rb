class User < ApplicationRecord
  validates :name, presence: true
  has_many :identifications
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Return the stats for a user
  def stats
   total_ids = self.identifications
   topAnimals = total_ids.where("correct_identification = true")
    .group("user_identification")
    .count
    .sort_by{|key, val| val}
    .reverse.slice(0,3)
   {
     :correct => total_ids.where("correct_identification = true").count,
     :incorrect => total_ids.where("user_identification IS NOT NULL AND correct_identification = false").count,
     :skipped => total_ids.where("user_identification IS NULL").count,
     :attempts => total_ids.where("user_identification IS NOT NULL").count,
     :animals => topAnimals.map{|key,val| [Animal.find(key).name, val]}.to_h
   }
  end
end
