export const environment = {
  production: true,
  api: {
    newsEndpoint: 'https://api.spaceflightnewsapi.net/v4/articles/',
    nasaEndpoint: 'https://images-api.nasa.gov/search',
    marsCuriosityEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
    marsOpportunityEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos',
    marsSpiritEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos',
    marsPerseveranceEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos',
    apodEndpoint: 'https://api.nasa.gov/planetary/apod',
    marsLatest: {
      marsCuriosityLatestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos',
      marsOpportunityLatestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos',
      marsSpiritLatestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos',
      marsPerseveranceLatestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos',
    },
    marsManifests: {
      marsCuriosityManifestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity',
      marsOpportunityManifestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity',
      marsSpiritManifestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/manifests/spirit',
      marsPerseveranceManifestEndpoint:
        'https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance',
    },
  },
  secrets: {
    api_key: import.meta.env.NG_APP_NASA_API_KEY || '',
  },
};
