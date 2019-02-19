import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./eventcard";
import { API_BASE_URL } from "../config";

import "../stylesheets/event-list.css";
import { callbackify } from "util";

export default function EventList(props) {
  const [events, setEvents] = useState(null);
  const [rsvpEvents, setRsvpEvents] = useState(null);

  const fetchData = async () => {
    const rsvpEventsRequest = await axios(`${API_BASE_URL}/rsvp/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(localStorage.getItem("jwtToken"))
      }
    });
    setRsvpEvents(rsvpEventsRequest.data);
    // added .populate(eventId) to server endpoint so now rsvpEventsRequest.data has events populated.

    // get all events
    const eventsRequest = await axios(`${API_BASE_URL}/event/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(localStorage.getItem("jwtToken"))
      }
    });
    setEvents(eventsRequest.data);
  };

  // gets all the events out of each individual rsvp.eventId and into array
  let rsvpEventList = [];
  const generateRsvpEventList = rsvpData => {
    rsvpData.forEach(rsvp => {
      // console.log('single event: ', rsvp.eventId)
      rsvpEventList.push(rsvp.eventId);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // generate EventCard components with rsvpEvent data
  let rsvpEventCardList;
  if (rsvpEvents) {
    generateRsvpEventList(rsvpEvents);
    rsvpEventCardList = rsvpEventList.map(event => {
      return <EventCard event={event} />;
    });
  }

  if (events === null) {
    return "Loading...";
  }

  return (
    <div classname="">
      <h3 className="eventsHeader">My Upcoming Events</h3>
      <div className="row">
        <div className="eventsContainer col s6">{rsvpEventCardList}</div>
      </div>
      {/* // PRODUCTION TODO ---> populate event cards with specific nearby events, and pass data down
  // to event cards more dynamically than just event[0] */}

      <h3 className="eventsHeader">Events Nearby</h3>
      <div className="row">
        {/* currently rendering all events, not nearby events */}
        <EventCard className="col s4" event={events[0]} />
        <EventCard className="col s4" event={events[1]} />
        <EventCard className="col s4" event={events[2]} />
      </div>
    </div>
  );
}
