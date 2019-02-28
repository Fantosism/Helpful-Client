import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./eventcard";
// import MeetupCard from "./meetup-card";
import { API_BASE_URL } from "../config";
import "../stylesheets/event-list.css";

export default function EventList() {
    const [events, setEvents] = useState(null);
    const [rsvpEvents, setRsvpEvents] = useState(null);
    // const [rsvpMeetups, setRsvpMeetups] = useState(null);
    // const [meetups, setMeetups] = useState(null);
    const [location, setLocation] = useState(null);

    // get user location
    const fetchUserLocation = async () => {
        if (!location) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    let results = {
                        lat: Number(position.coords.latitude.toFixed(7)),
                        lng: Number(position.coords.longitude.toFixed(7)),
                    };
                    setLocation(results);
                });
            }
        }
    };

    // get all rsvp'd events
    const fetchRsvpData = async () => {
        const rsvpEventsRequest = await axios(`${API_BASE_URL}/rsvp/user`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ".concat(
                    localStorage.getItem("jwtToken")
                ),
            },
        });
        setRsvpEvents(rsvpEventsRequest.data);
    };

    // get all meetuprsvps
    // const fetchMeetupRsvpData = async () => {
    //     const rsvpMeetupsRequest = await axios(`${API_BASE_URL}/rsvpmeetup/user`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer ".concat(
    //                 localStorage.getItem("jwtToken")
    //             ),
    //         },
    //     });
    //     setRsvpMeetups(rsvpMeetupsRequest.data);
    //     console.log(rsvpMeetups)
    // };

    // get all events *filter if user allows location*
    const fetchEventData = async () => {
        if (!location) {
            axios(`${API_BASE_URL}/event/all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer ".concat(
                        localStorage.getItem("jwtToken")
                    ),
                },
            }).then(res => {
                if (res.data) {
                    setEvents(res.data);
                }
            });
        } else if (location) {
            axios
                .get(
                    `${API_BASE_URL}/event/location/2000/${location.lat}/${
                        location.lng
                    }`, // set at 2000 for testing
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(
                                localStorage.getItem("jwtToken")
                            ),
                        },
                    }
                )
                .then(res => {
                    if (res.data) {
                        setEvents(res.data);
                    }
                });
        }
    };

    // get all user meetup
    // const fetchMeetupData = async () => {
    //     const meetupRequest = await axios(`${API_BASE_URL}/meetup/owner`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer ".concat(
    //                 localStorage.getItem("jwtToken")
    //             ),
    //         },
    //     });
    //     setMeetups(meetupRequest.data);
    // };

    useEffect(() => {
        fetchUserLocation();
        fetchRsvpData();
        fetchEventData();
        // fetchMeetupData();
        // fetchMeetupRsvpData();
    }, [location]);

    // gets all the events out of each individual rsvp.eventId and into array
    let rsvpEventList = [];
    const generateRsvpEventList = rsvpData => {
        rsvpData.forEach(rsvp => {
            rsvpEventList.push(rsvp.eventId);
        });
    };

    // let rsvpMeetupList = [];
    // const generateRsvpMeetupList = rsvpData => {
    //     rsvpData.forEach(rsvp => {
    //         rsvpMeetupList.push(rsvp.eventId);
    //     });
    // };

    // generate EventCard components with event data
    let rsvpEventCardList, localEventCardList;
    // let rsvpMeetupCardList, meetupCardList;
    let eventTitle = "Nearby Events";
    if (rsvpEvents) {
        generateRsvpEventList(rsvpEvents);
        rsvpEventCardList = rsvpEventList.map((event, index) => {
            return <EventCard key={index} event={event} />;
        });
    }
    // if (rsvpMeetups) {
    //     generateRsvpMeetupList(rsvpMeetups);
    //     rsvpMeetupCardList = rsvpMeetupList.map((event, index) => {
    //         return <MeetupCard key={index} event={event} />;
    //     });
    // }
    if (events) {
        localEventCardList = events.map((event, index) => {
            return <EventCard key={index} event={event} />;
        });
    }
    // if (meetups) {
    //     meetupCardList = meetups.map((event, index) => {
    //         return <MeetupCard key={index} event={event} />;
    //     });
    // }
    if (!location) {
        eventTitle = "All Events";
    }

    return (
        <section className='event-container'>
                <div className='rsvp-events'>
                    <h2>Upcoming Events</h2>
                    <div className='event-list'>
                        {rsvpEventCardList}
                        {/* {rsvpMeetupCardList} */}
                    </div>
                </div>
                <div className='events'>
                    <h2>Nearby Events</h2>
                    <div className='event-list'>
                        {localEventCardList}
                    </div>
                </div>
                {/* <div className='section'>
                    <div className='col s12'>
                        <span className='title'>My Meetups</span>
                    </div>
                    <div className='eventsContainer col s12 m6 l4'>
                        {meetupCardList}
                    </div>
                </div> */}
        </section>
    );
}

// TODO add button to toggle between nearby and all events or searching methods.
