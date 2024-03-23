import { useNavigate, Form, useNavigation, useActionData, json, redirect } from 'react-router-dom';

import classes from './EventForm.module.css';

function EventForm({ method, event }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  function cancelHandler() {
    navigate('..');
  }

  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => <li key={err}>{err}</li>)}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" defaultValue={event?.title ? event?.title : ""} required />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="url" name="image" defaultValue={event?.image ? event?.image : ""} required />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" defaultValue={event?.data ? event?.date : ""} required />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" defaultValue={event?.description ? event?.description : ""} required />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
        <button disabled={isSubmitting ? true : false}>{isSubmitting ? "Submitting..." : "Save"}</button>
      </div>
    </Form>
  );
}

export default EventForm;

export async function action({ request, params }){
  const method = request.method;
  const data = await request.formData();

  const enteredData = {
    title: data.get("title"),
    image: data.get("image"),
    date: data.get("date"),
    description: data.get("description"),
  }

  let url = "http://localhost:8080/events";

  if(method === "PATCH"){
    const { eventId } = params;

    url = "http://localhost:8080/events/" + eventId;
  }

    try{
        const resData = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enteredData),
        });
        // console.log(resData);
        if(resData.ok){
          return redirect("/events");
        }
    }catch(err){
      console.log(err)
        if(err?.response?.status === 404 || err?.response?.data?.status === 404){
            return err?.response;
        }
        throw json({ message: "Could not save events." }, { status: 500 });
    }
}