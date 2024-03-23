import React, { Suspense } from 'react';
import { json, redirect, useParams, useRouteLoaderData, defer, Await } from 'react-router-dom';
import EventItem from '../components/EventItem';
import EventsList from '../components/EventsList';

const EventDetailPage = () => {
  // const data = useRouteLoaderData("event-detail");

  // return <EventItem event={data?.event} />

  const { event, events } = useRouteLoaderData("event-detail");
  
  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  )
}

export default EventDetailPage;

async function loadEvent(id){
  try{
    const resData = await fetch("http://localhost:8080/events/" + id);
    
    if(resData.ok){
      const data = await resData.json();
      return data.event;
    }
  }catch(err){
    console.log(err);
    throw json({ message: "Could not fetch details for selected event" }, { status: 500 });
  }
}

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

export async function loader({request, params}){
  const id = params.eventId;

  return defer({
    event: await loadEvent(id),
    events: loadEvents()
  })
}

export async function action({ request, params }){
    const { eventId } = params;
    try{
        const resData = await fetch('http://localhost:8080/events/' + eventId, {
            method: request.method,
        });

        if(resData?.ok){
            redirect("/events");
        }
    }catch(err){
        console.log(err);
        throw json({ message: "Could not delete event." }, { status: 500 });
    }
}


/*

export async function loader({request, params}){
  const { eventId } = params;
    
  try{
    const resData = await fetch("http://localhost:8080/events/" + eventId);
    
    if(resData.ok){
        return resData;
    }
  }catch(err){
    console.log(err);
    throw json({ message: "Could not fetch details for selected event" }, { status: 500 });
  }
}

export async function action({ request, params }){
    const { eventId } = params;
    try{
        const resData = await fetch('http://localhost:8080/events/' + eventId, {
            method: request.method,
        });

        if(resData?.ok){
            redirect("/events");
        }
    }catch(err){
        console.log(err);
        throw json({ message: "Could not delete event." }, { status: 500 });
    }
}

*/