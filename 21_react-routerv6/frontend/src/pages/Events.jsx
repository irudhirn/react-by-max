import React, { Suspense } from 'react';
import { Link, useLoaderData, useNavigation, defer, Await } from 'react-router-dom';

import EventsList from "../components/EventsList";

const EventsPage = () => {
  // const data = useLoaderData();
  // const navigation = useNavigation();

  // if(data?.isError) return <h3>{data?.message}</h3>
  // if(navigation.state === "loading") return <h3>Loading...</h3>

  // return <EventsList events={data?.events} />

  const { events } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  )
}

export default EventsPage;

async function loadEvents(){
  try{
    const resData = await fetch("http://localhost:8080/events");
    if(resData.ok){
      const data = await resData.json();
      return data.events;
    }
  }catch(err){
    console.log(err);
    // return { isError: true, message: "Could not fetch events." }
    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), { status: 500 });
    return json({ message: "Could not fetch events." }, { status: 500 })
  }  
}

export const loader = () => {
  return defer({
    events: loadEvents()
  })
}

/*

export const loader = async () => {
  try{
    const resData = await fetch("http://localhost:8080/events");
    if(resData.ok){
      const data = await resData.json();
      return data;
    }
  }catch(err){
    console.log(err);
    // return { isError: true, message: "Could not fetch events." }
    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), { status: 500 });
    return json({ message: "Could not fetch events." }, { status: 500 })
  }
}

*/