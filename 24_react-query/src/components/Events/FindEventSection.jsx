import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();

  const [searchTerm, setSearchTerm] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { searchTerm: searchTerm }],
    queryFn: ({signal, queryKey}) => fetchEvents({ signal, ...queryKey[1] }),
    enabled: searchTerm !== undefined
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading){
    content = <LoadingIndicator />
  }

  if(isError){
    content = <ErrorBlock title="An error occured" message={error.info?.message || "Failed to fetch events."} />
  }

  if(data){
    content = <ul className='events-list'>
      {data.map((event) => <li key={event.id}><EventItem event={event} /></li>)}
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}

/*

Here we need to implement search functionality. So to 'fetchEvents' function from 'http.js' we need pass 'searchTerm' as an argument, which we'll add as query parameter in API url. So we invoke 'fetchEvents' function in anonymous callback function in 'queryFn' and pass 'searchTerm' as an argument. To ensure that 'useQuery' is executed only if 'searchTerm' has a string value, we use one more property 'enabled' and its value will be boolean.

But 'useQuery' passes some default data (which is object) to the function it is executing. This default data object consists of 'meta', 'query' which is array, and 'signal' which is required for aborting that request for e.g in case if we navigate away from page before request was finished. React Query can abort request for us with the help of 'signal'. To pass this 'signal' along with our 'searchTerm' react-query passes this data in object. Therefor in 'http.js' where we define 'fetchEvents' we destructure the parameters and also in 'queryFn' we pass data in argument in a same way(in object), and we get this signal from anonymous callback function in 'queryFn' which we can destructure. And in 'http.js', in 'fetchEvents' function we pass this 'signal' as a payload in an object.

Now we see loading spinner initially and we see that because when a Query is disabled (which initially is the case), React Query treats it as pending because we don't have any data. And instead we're waiting for data to arrive, which can only happen once the Query is enabled. But that's why initially it treats it as is pending because it kind of waits for this Query to be enabled.

Now that's not the behavior we want. We don't want a loading spinner if we're waiting for the user to enter something in input field. And that's why React Query gives us an alternative to 'isPending', we can use 'isLoading' boolean. The difference between 'isLoading' and 'isPending' is that 'isLoading' will not be true if this 'useQuery' is disabled. So therefore, if we switch from 'isPending to 'isLoading', we start with info text for the user and user can then enter something in input field after which get that loading spinner and then result and user can clear that to go back to all the search results.

*/

/*

- Initial Code

import { useRef } from 'react';

export default function FindEventSection() {
  const searchElement = useRef();

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
    </section>
  );
}

*/