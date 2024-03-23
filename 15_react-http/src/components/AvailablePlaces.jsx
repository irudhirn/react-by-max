import { useEffect, useState } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    // fetch('http://localhost:3000/places').then((res) => res.json()).then((data) => setAvailablePlaces(data.places));

    async function fetchPlaces(){
      setIsFetching(true);

      try{

        const data = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            data.places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
        });
        setIsFetching(false);

        // setAvailablePlaces(data.places);
      }catch(err){
        setError({message: err.message || "Could not fetch places, please try again later."});
        setIsFetching(false);
      }


      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

  if(error){
    return <Error title="An error occured" message={error.message} onConfirm={() => setError(undefined)} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
