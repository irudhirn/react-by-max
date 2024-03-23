import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && <ErrorBlock title="Failed to create event" message={error.info?.message || "Failed to create event."} />}
    </Modal>
  );
}

/*

Just like getting data, 'react-query' can be used to send data. We need to collect data entered by the user in form (<EventForm /> component).

To send data on backend, we use different hook - 'useMutation'. (we used 'useQuery' to get data, we'll use 'usemutation' to get data). We can use 'useQuery' to send data because anyway we are defining the logic for http request, but 'useMutation' is more optimized for data changing queries, for e.g. simply by making sure those requests not sent instantly when that particular component is renders (which is default behaviour of useQuery), but instead requests are only sent whenever we want to send them.

So we import 'useMutation', we use in component, pass configuration object to it and like 'queryFn' for 'useQuery', we pass 'mutationFn' for 'useMutation'. We avoid 'mutationKey' here purpose is not to cache data. We pass 'createNewEvent' function as a value to 'mutationFn'. Then we destructure properties returned by 'mutationFn'. We extract 'mutate' function which important because this is the function which we can call anywhere in our component to send request. So in 'handleSubmit' we call 'mutate' function and pass data entered by user as an argument. Along with 'mutate', we also get 'isPending', 'isError' & 'error' properties returned by 'useMutation'. We can use these properties to render content conditionally.

We should also give user ability select image from provided image. So we fetch those images in <EventForm /> component.

After all of this, if we submit we see nothing happens because we haven't added logic fro what should happen in case of 'useMutation' succeds. Therefore, we add 'onSucess' property besides 'mutationFn' and 'onSucess' will anonymous function as a value. This function will only execute in case of success. We want to navigate to '/events' page but that way we don't se newly added event. If we navigate away and again come back to '/events' the we newly added event because that triggers 'react-query' to refetch data behind the scenes. But we want 'react-query' to immedialy refetch data. We achieve this by method provided by 'react-query' that allows us invalidate one or more queries(i.e. it allows us to tell 'react-query' that data which is connected to some queries is outdated and it should be refetched).

To achieve this, we move 'const queryClient = new QueryClient();' from App.jsx to a file from where it can be exported and will accessible to other files too, like 'http.js' file. Now we can use that same 'queryClient' in 'onSuccess', because there before navigating to '/events' page we call 'queryClient.invalidateQueries()' which tells 'react-query' that the data fetched by certain queries is outdated now and it should marked as stale and that immediate refetch should be triggered if query belongs to a component that currently visible on the screen. So to target specific query 'invalidateQueries()' takes an object as input in which we define 'queryKey' which we want to target, this 'queryKey' should be in a same format (an array format). So wa add "events" key in array of 'queryKey', this way after navigating to '/events' page onSuccess we see newly added event.


*/

/*

- Initial Code

import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  function handleSubmit(formData) {}

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>
      </EventForm>
    </Modal>
  );
}

*/