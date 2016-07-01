json.array!(@photos) do |photo|
  json.extract! photo, :id, :animal, :source
  json.url photo_url(photo, format: :json)
end
