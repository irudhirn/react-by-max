import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", {max: 3}],
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    staleTime: 10000, // new req will be sent only after 5 sec, if we revisit page before 5 sec, data in cache will be used.
    // gcTime: 30000 // Garbage Collection time controls how long data in cache should be kept around, default is 5 mins
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events"} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

/*

2nd last chapter
- Using 'queryKey' as 'queryFn' input

In 'NewEventsSection' component we are initially showing all the events, which can't always be the case in real scenario. So we might want to show just some (3) events. So we need to pass 'max' value as an argument in 'fetchEvents' in 'queryFn'. So also put same thing in 'queryKey'. Now we get same 'queryKey' in arguments of 'queryFn', so we take it from there.

*/

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/*

import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 10000, // new req will be sent only after 5 sec, if we revisit page before 5 sec, data in cache will be used.
    // gcTime: 30000 // Garbage Collection time controls how long data in cache should be kept around, default is 5 mins
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events"} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

*/

/*

To be able to use TanStack Query, we must wrap those componets which want to use its features, with <QueryClientProvider> which will have a 'client' attribute with value 'queryClient' which we get from constructor function 'new QueryClient()' provided by '@tanstack/react-query'.

We import 'useQuery' hook from '@tanstack/react-query'. Then we use this hook in react component and this hook will now behind the scenes send an HTTP requests and get us Events' data, and also give us information about 'loading' state & potential errors.

To achieve all that we must configure this 'useQuery' hook, we can do that by passing object to it. In this object we can set various properties. One we're going to use is 'queryFn'(query function) property. With this function we can define the actual code that will be executed that will send the actual request.

TanStack Query does not come with some built in logic to send some HTTP requests. Instead it comes with logic for managing those requests for keeping track of data and possible errors that are yielded by those requests. The code for sending requests must be defined by us. We can use normal 'fetch' function OR 'axios'. Technically we don't even have to send request in 'queryFn' because all that 'useQuery' wants is function that returns a promise. So we point at 'fetchEvents' function as a value for 'queryFn' property.

But there is one more property that we should add, 'queryKey' property. Every request should have this 'queryKey', which will then internally be used by TanStack Query to cache the data that is yielded by that request, so that the response from that reuqest could be used in future if we are trying to send the same request again and we can configure how long data should be stored by a react-query. So this 'queryKey' needs a key and that key is an array of values which are internally stored by react-query such that whenever we are using similar array of similar values, react-query sees that and is able to reuse existing data.

Then data(data is in object form) returned by this 'useQuery' hook can be stored in a variable OR we can destructure that data. We pull 'data' property which is actual data in response value, another we get is 'isPending' property, 'isError'(value is true) property in case of error occurs(to make sure 'isError' is true, our code that sends the request must throw Error in case of error), then we also get 'error' property which contains info of that error. and there is more data we can pull from 'useQuery'.

*/

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/*

- Initial Code

import { useEffect, useState } from 'react';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function NewEventsSection() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/events');

      if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }

      const { events } = await response.json();

      return events;
    }

    fetchEvents()
      .then((events) => {
        setData(events);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock title="An error occurred" message="Failed to fetch events" />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

*/