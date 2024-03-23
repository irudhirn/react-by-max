// Challenge / Exercise

// 1. Add five new (dummy) page components (content can be simple <h1> elements)
//    - HomePage
//    - EventsPage
//    - EventDetailPage
//    - NewEventPage
//    - EditEventPage
// DONE
// 2. Add routing & route definitions for these five pages
//    - / => HomePage
//    - /events => EventsPage
//    - /events/<some-id> => EventDetailPage
//    - /events/new => NewEventPage
//    - /events/<some-id>/edit => EditEventPage
// DONE
// 3. Add a root layout that adds the <MainNavigation> component above all page components
// DONE
// 4. Add properly working links to the MainNavigation
// DONE
// 5. Ensure that the links in MainNavigation receive an "active" class when active
// DONE
// 6. Output a list of dummy events to the EventsPage
//    Every list item should include a link to the respective EventDetailPage
// DONE
// 7. Output the ID of the selected event on the EventDetailPage
// BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import EventsPage, { loader as eventsLoader } from "./pages/Events";
import EditEventPage from "./pages/EditEvent";
import NewEventPage from "./pages/NewEvent";
import EventDetailPage, { loader as eventDetailLoader, action as deleteEventAction } from "./pages/EventDetail";
import RootLayout from "./pages/RootLayout";
import EventRootLayout from "./pages/EventRootLayout";
import ErrorPage from "./pages/Error";
import NewsletterPage, { action as newsletterAction } from "./pages/NewsletterPage";
import { action as manipulateEventAction } from "./components/EventForm";

function App() {

  const router = createBrowserRouter([
    { 
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "events",
          element: <EventRootLayout />,
          children: [
            { index: true, element: <EventsPage />, loader: eventsLoader },
            { path: "new", element: <NewEventPage />, action: manipulateEventAction },
            {
              path: ":eventId",
              id: "event-detail",
              loader: eventDetailLoader,
              children: [
                { index: true, element: <EventDetailPage /> },
                { path: "edit", element: <EditEventPage />, action: manipulateEventAction },
              ]
            },
          ]
        },
        {
          path: 'newsletter',
          element: <NewsletterPage />,
          action: newsletterAction,
        },
      ]
    },
  ]);

  return <RouterProvider router={router}/>;
}

export default App;
