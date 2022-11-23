import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";
import MoneyFormatter from "../utils/MoneyFormatter";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Listing() {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  return (
    <main>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[index]}) center no-repeat`,
                  }}
                  className="swiperSlideDiv"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="shareIconDiv"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShareLinkCopied(true);
              setTimeout(() => {
                setShareLinkCopied(false);
              }, 3000);
            }}
          >
            <img src={shareIcon} alt="share icon" />
          </div>
          {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
          <div className="listingDetails">
            <p className="listingName">
              {listing.name} -{" "}
              {MoneyFormatter(
                listing.offer ? listing.discountedPrice : listing.regularPrice
              )}
            </p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">
              For {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </p>
            {listing.offer && (
              <p className="discountedPrice">
                {MoneyFormatter(listing.regularPrice - listing.discountedPrice)}{" "}
                discount
              </p>
            )}
            <u className="listingDetailsList">
              <li>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </li>
              <li>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </li>
              <li>{listing.parking && "Parking Spot"}</li>
              <li>{listing.furnished && "Furnished"}</li>
            </u>
            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
              <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[
                  listing.geolocation.latitude,
                  listing.geolocation.longitude,
                ]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    listing.geolocation.latitude,
                    listing.geolocation.longitude,
                  ]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {auth.currentUser?.uid !== listing.userRef && (
              <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}&${listing.location}`}
                className="primaryButton"
              >
                Contact Landlord
              </Link>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Listing;

/* 

  "browserlist": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]

*/
