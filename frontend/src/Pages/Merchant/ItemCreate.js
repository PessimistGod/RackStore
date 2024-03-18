import React, { useEffect, useState } from "react";
import styles from "./ItemCreate.module.css";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";
import GoogleMapReact from "google-map-react";

const ItemCreate = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSuccessToast, showErrorToast } = useToast();
  const [uid, setUid] = useState(null);

  const [GmapKey, setGmapKey] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  const defaultProps = {
    center: {
      lat: 20.5937,
      lng: 78.9629,
    },
    zoom: 4,
  };

  const [item, setItem] = useState({
    productName: "",
    days: "",
    price: "",
    image: "",
    state: "",
    pincode: "",
    details:"",
    lati: "",
    longi: "",
    city: "",
  });
  const [mapKey, setMapKey] = useState(0);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.value;
    setItem({ ...item, image });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isMerchant) {
        navigate("/login");
      } else {
        setUid(decodedToken.id);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/mapper`);
        setGmapKey(response.data);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...item, userId: uid };
    try {
      const response = await axios.post(
        `${API_URL}/api/prod/products`,
        productData
      );
      if (response) {
        setItem({
          productName: "",
          days: "",
          price: "",
          image: "",
          state: "",
          pincode: "",
          details:"",
          lati: "",
          longi: "",
          city: "",
        });
        setSelectedLocation(null);
        setCenter(defaultProps?.center);
        setZoom(defaultProps?.zoom);
      }
      showSuccessToast("Rack Added Successfully");
    } catch (error) {
      showErrorToast("Error Try Again");
      console.error("Error creating item:", error);
    }
  };

  useEffect(() => {
    const fetchLatlongByPincode = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${item?.pincode}&key=${GmapKey}`
        );
        const { lat, lng } = response.data.results[0]?.geometry?.location;
        setCenter({ ...center, lat, lng });
        setZoom(18);
        setSelectedLocation({ lat, lng });
        setItem({ ...item, lati: lat, longi: lng });
      } catch (error) {
        console.error("Error fetching lat long:", error);
      }
    };
    if (item?.pincode?.length === 6) {
      fetchLatlongByPincode();
    }
    // eslint-disable-next-line
  }, [item.pincode, GmapKey]);

  const handleMapClick = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
    setCenter({ lat, lng });
    setZoom(18);
    setItem({ ...item, lati: lat, longi: lng });
  };

  const renderMarkers = (map, maps) => {
    if (selectedLocation) {
      let marker = new maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        title: "",
      });
      return marker;
    }
  };

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1); // Update the key when selectedLocation changes
  }, [selectedLocation]);

  return (
    <div className={styles.form_container_create}>
      <h2>Create a New Rack</h2>
      <form className={styles.item_form} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="image" className={styles.label}>
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={item.image}
            onChange={handleImageChange}
            className={styles.input}
          />
          {item.image && (
            <div className={styles.image_preview}>
              <img
                src={item.image}
                alt="Item Preview"
                className={styles.preview}
              />
            </div>
          )}
        </div>
        <div className={styles.form_group}>
          <label htmlFor="productName" className={styles.label}>
            Rack Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={item.productName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="days" className={styles.label}>
            Days
          </label>
          <input
            type="text"
            id="days"
            name="days"
            value={item.days}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price" className={styles.label}>
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={item.price}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state" className={styles.label}>
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={item.state}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={item.city}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pincode" className={styles.label}>
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={item.pincode}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className="form-group mt-4">
        <label htmlFor="details" className={styles.label}>
            Rack Details
          </label>

          <div class="relative w-full min-w-[200px]">

            <textarea
              className={styles.input}
              placeholder=""
              name="details"
              value={item.details}
              onChange={handleChange}
            ></textarea>

          </div>
        </div>
        {GmapKey && (
          <div
            className="form-group py-6"
            style={{ width: "100%", height: "400px" }}
          >
            <label htmlFor="location" className={styles.label}>
              Location
            </label>
            <GoogleMapReact
              key={mapKey} // Set key to force re-render
              onClick={handleMapClick}
              bootstrapURLKeys={{ key: GmapKey.toString() }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              center={center}
              zoom={zoom}
              options={(maps) => {
                return {
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: maps.ControlPosition.BOTTOM_CENTER,
                    mapTypeIds: [
                      maps.MapTypeId.ROADMAP,
                      maps.MapTypeId.SATELLITE,
                      maps.MapTypeId.HYBRID,
                    ],
                  },
                  zoomControl: true,
                  clickableIcons: false,
                };
              }}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
            />
          </div>
        )}

        <div className="pt-4">
          <button type="submit" className={styles.button}>
            Create Rack
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemCreate;
