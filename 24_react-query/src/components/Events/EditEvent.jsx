import React from 'react';
import { Link, useNavigate, useParams,useNavigation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useNavigation();
  // const { data, isPending, isError, error } = useQuery({
  const { data, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
    staleTime: 10000
  });

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     const newEvent = data.event;

  //     await queryClient.cancelQueries({ queryKey: ["events", id] });
  //     const prevEvent = queryClient.getQueryData(["events", id]);

  //     queryClient.setQueryData(["events", id], newEvent);

  //     return { prevEvent }
  //   },
  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(["events", id], context.prevEvent);
  //   },
  //   onSettled: () => {}
  // });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  // if (isPending){
  //   content = <div className='center'><LoadingIndicator /></div>
  // }

  if(isError){
    content = <>
      <ErrorBlock title="Failed to load event" message={error.info?.message || "Failed to fetch events."} />
      <div className="form-actions">
        <Link to="../" className="button">
          Okay
        </Link>
      </div>
    </>
  }

  if(data){
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Submitting...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

export function loader({ request, params }){
  const { id } = params;

  return queryClient.fetchQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });
}

export async function action({ request, params }){
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries("events");
  return redirect("../");
}

/*

With loader function, we can start fetching before we reach on that particular page. To do that with react-query we must have access to the 'queryClient'. Because in 'loader()' function we can't use 'useQuery()' hook since 'loader()' function is not a part of React Component Function and hooks can only be used inside React Components, that's why we have to fetch data with the help of 'queryClient' which directly has access to 'fetchQuery()' method, and it can trigger a query programmatically. 'fetchQuery()' uses a same configuration object as 'useQuery()'.

No we need to return the 'Promise' returned from 'fetchQuery()' method and 'loader()' will waits for that 'Promise' to resolve before react-router renders the component. Now, even though we get access to data returned from 'loader()' function with 'useLoaderData()' in React Component, it is better to keep 'useQuery()' in component. Because when we use 'fetchQuery()' in the 'loader()', react-query will send that request and store that response in 'cache'. Therefore when 'useQuery()' is executed again in the component, that cached data will be used, but we keep all advantages that react-query offers. For e.g. if we switch screens and come back to our webpage, request is triggered behind the scenes to look for updated data.

Similarly we can use react-query to send data in an 'action()' function. 'action()' function will be triggered when a form on that page is submitted. So we do that by normally invoking 'updateEvent' function and passing arguments to it. Then we use 'queryClient' to invalidate all queries with 'invalidateQueries()' method to make sure that the updated data fetched again, and with that we'll not be performing Optimistic Updating anymore. So to submit a form programmatically, we use 'submit' function from 'useSubmit()' hook. We call 'submit' function in 'handleSubmit' function. So first argument we pass is 'formData' and in second argument we pass a configuration object in which we set the method anything but 'get'. So this 'submit()' function will trigger 'action()' function. This way it takes little while to see an updated UI, so we use 'useNavigation' hook to show loading state.

*/


/*

// - Code before loader()

import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await queryClient.cancelQueries({ queryKey: ["events", id] });
      const prevEvent = queryClient.getQueryData(["events", id]);

      queryClient.setQueryData(["events", id], newEvent);

      return { prevEvent }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["events", id], context.prevEvent);
    },
    onSettled: () => {}
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isPending){
    content = <div className='center'><LoadingIndicator /></div>
  }

  if(isError){
    content = <>
      <ErrorBlock title="Failed to load event" message={error.info?.message || "Failed to fetch events."} />
      <div className="form-actions">
        <Link to="../" className="button">
          Okay
        </Link>
      </div>
    </>
  }

  if(data){
    content = <EventForm inputData={data} onSubmit={handleSubmit}>
      <Link to="../" className="button-text">
        Cancel
      </Link>
      <button type="submit" className="button">
        Update
      </button>
    </EventForm>
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

*/

/*

When we try to edit, to pre-populate for in Modal, we first fetch data with 'useQuery' & pass to <EventForm /> via props. To update event we use 'useMutation' function as usual. But this way, changes won't reflect immedialtely on event detail page.

One solution for this could be use 'onSuccess' property in 'useMutation' configuration object inside which we'll call queryClient.invalidateQueries() function, (which will invalidate all the queries that need the latest data) and then will trigger refetching. But in that case we should also wait until navigating away and we'll need to show loading spinner while we're waiting for mutation to succeed.

Another solution is Optimistic Updating. It means we'll update UI instantly without waiting for response from backend, and if the update is failed from backend then we simply rollback the Optimistic Update we performed. This approach is relatively easy with react-query. We need to add extra property 'onMutate' in configuration object, whose value is anonymous callback function which will be executed right when we call mutate() function i.e. before we get response. So in 'onMutate' function we want to update the data which is cached by react-query. So we import 'queryClient' from 'http.js' and in 'onMutate' function, we call 'setQueryData()' method on 'queryClient' (queryClient.setQueryData()). This 'setQueryData()' needs two arguments, first is the key of the query that we want to edit, which in our case is ["events", id]. And second argument is the data that we want to store under that query key which in our situation is the 'formData' that we are submitting. This data we can get in 'onMutate' as an argument (this data is passed by 'mutate()' function as an argument).

Another thing we should do while performing Optimistic Updating is that we should also cancel all active queries for specific key using 'queryClient.cancelQueries()'. We pass object with query key for which we want to cancel query. With this cancelling of active queries, we're making sure that if we had any outgoing queries for that particular keys then those queries will be cancelled and we will not have clashing response data from those queries and our optmistically updated query data. Because if those ongoing queries finished before updating request was done, we would've fetched old data again. This 'cancelQueries()' returns a promise so we need to use 'await'. 'cancelQueries()' will not cancel mutation it will only cancel queries.

To rollback our query to previous data in case of failed reponse, we should store that data somewhere, we should do that before we update the data. For this 'queryClient' has a method 'getQueryData()' which gives us currently stored query data, which we want to execute before we set it to some new data. This 'getQueryData()' simply wants the key of the query for which we want to get the data, with that we get previous data. Now to rollback to previous data, we can add 'onError' property to 'useMutation' configuration object, which has a function as a value. This function gets 3 arguments, 'error' object, 'data' which was submitted to the mutation and a 'context' object. This 'context' object can contain previous data we want to rollback to. But in order to this 'context' object to have previous data, we should return an object in 'onMutate' function because that object returned will the 'context' object. And again we use 'queryClient.setQueryData()' with same 2 arguments discussed above, where 2nd argument is the 'context.previousData'.

In addition we should use one more property in 'useMutation' configuration object which is 'onSettled' property which is also a function. This 'onSettled' will be called whenever mutation is done irrespective of whether it is failed OR succeeded. So just to make sure that we got same data on frontedn and backend we should again use 'queryClient.invalidateQueries(["events", id])'. With this we make sure that after mutation finished even though we performed Optimistic Updating and rollback to old data if things went wrong, we still make sure that we fetched the latest data from backend, so that if backend did something different and UI is not in sync with backend then it gets in sync with backend by forcing react-query to refetch the data behind the scenes.

*/

/*

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';

export default function EditEvent() {
  const navigate = useNavigate();

  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={null} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}

*/