class User < ApplicationRecord
  has_many :identifications
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Return the stats for a user
  def stats
   total_ids = self.identifications
   {
     :correct => total_ids.where("correct_identification = true").count,
     :incorrect => total_ids.where("user_identification IS NOT NULL AND correct_identification = false").count,
     :skipped => total_ids.where("user_identification IS NULL").count,
     :total => total_ids.count
   }
  end
end
