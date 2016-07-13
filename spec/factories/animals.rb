FactoryGirl.define do
  factory :animal do
    sequence :id do |n|
      n
    end
    name "Coyote"
    sci_name "Coyote Rex"
  end

end
