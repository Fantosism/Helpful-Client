import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./eventCard";
import { API_BASE_URL } from "../config";

export default function OrgPublicPageEventList(props) {
    const [events, setEvents] = useState(null);

    const fetchData = async () => {
        const eventsRequest = await axios(
            `${API_BASE_URL}/event/org/${props.id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer ".concat(
                        localStorage.getItem("jwtToken")
                    ),
                },
            }
        );
        return setEvents(eventsRequest.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (events) {
        const eventsRender = events.map((event, index) => {
            return <EventCard key={index} event={event} />;
        });
        return (
            <article>
                <section className='upcomingEvents'>
                    <h3 className='eventsHeader'> Upcoming Events</h3>
                    <div className='eventsContainer'>{eventsRender}</div>
                </section>
            </article>
        );
    }
    return <p>loading...</p>;
}
