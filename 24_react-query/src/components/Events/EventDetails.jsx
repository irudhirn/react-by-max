import { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const { mutate, isPending: isPendingDeletion, isError: isErrorDeleting, error: deleteError } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], refetchType: "none" });
      navigate("/events");
    }
  });

  function handleStartDelete(){
    setIsDeleting(true);
  }
  function handleStopDelete(){
    setIsDeleting(false);
  }

  function handleDelete(){
    mutate({ id })
  }

  let content;

  if (isPending){
    content = <div className='center'><LoadingIndicator /></div>
  }

  if(isError){
    content = <ErrorBlock title="An error occured" message={error.info?.message || "Failed to fetch events."} />
  }

  if(data){
    content = <>
      <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleStartDelete}>Delete</button>
          <Link to="edit">Edit</Link>
        </nav>
      </header>
      <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>{new Date(data.date).toLocaleDateString("en-US", {day: 'numeric', month: "short", year:"numeric"})} @{data.time}</time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    </>
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event? This action cannot be reverted.</p>
          <div className="form-actions">
            {isPendingDeletion && <p>Deleting...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className="button-text">Cancel</button>
                <button onClick={handleDelete} className="button">Delete</button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock title="Failed to fetch event" message={deleteError.info?.message || 'Failed to delete event, please try again later'} />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
        {/* <header>
          <h1>{data.title}</h1>
          <nav>
            <button>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div> */}
      </article>
    </>
  );
}

/*

After delete is successful we call 'queryClient.invalidateQueries()' followed by 'navigate' to '/events' page. This way in 'network tab' we see one request being sent to fetch event details of the event we just deleted(for which we get 404 error, because that event just got deleted), then we navigate away. This happens because after deleting that event we invalidated all "events" related queries and we were still on that page. And therefore since we invalidated all queries, react-query went ahead and immediately triggered a refetch on that same details page for that same event we just deleted and so event was not found on backend and that's why we get 404 error.

To avoid this behaviour, we should add second property to configuration object in 'queryClient.invalidateQueries()', that second property is 'refetchType' and its value will be none. This will make sure when we call 'queryClient.invalidateQueries()', existing queries will not automatically be triggered again immediately, instead they will just be invalidated and the next time they are required, they will run again, but they will not re-triggered immediately. So, query on event details page is not triggred again but if we go back to "/events" page, then queries on that page will be triggered again because that component re-rendered again.

*/


/*

- Initial Code

import { Link, Outlet } from 'react-router-dom';

import Header from '../Header.jsx';

export default function EventDetails() {
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>EVENT TITLE</h1>
          <nav>
            <button>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src="" alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">EVENT LOCATION</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>DATE @ TIME</time>
            </div>
            <p id="event-details-description">EVENT DESCRIPTION</p>
          </div>
        </div>
      </article>
    </>
  );
}


*/