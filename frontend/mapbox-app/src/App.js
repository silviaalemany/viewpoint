import React, { useRef, useEffect, useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';

import AddButton from './AddButton';
import { MAPBOXKEY } from './keys';
import 'bootstrap/dist/css/bootstrap.min.css';
// TODO: Move this to .env file. 
mapboxgl.accessToken = MAPBOXKEY.apiKey;
const backend_url = 'http://localhost:8002'

export default function App() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	var foundCurrentLocation = useRef(null);
	var activatedSearchBar = useRef(null);
	// TODO: Move these configs to some other file. 
	const [lng, setLng] = useState(-75.158924);
	const [lat, setLat] = useState(39.9629223);
	const [zoom, setZoom] = useState(11);
	const [suggestionsPosted, setSuggestionsPosted] = useState([]);
	const [allSuggestions, setAllSuggestions] = useState([]);
	const [markers, setMarkers] = useState([]);
	const [address, setAddress] = useState('');
	const userId = '0';

	var pinLng;
	var pinLat;
	var marker;
	var formData = {};

	async function getAllSuggestions() {
		return axios.post(backend_url + '/list?')
	}

	async function updateSuggestions() {
		const resp = await getAllSuggestions();
		setAllSuggestions(resp.data.entries);
	}

	function updateMarkers() {
		for(let i = 0; i < allSuggestions.length; i++)
		{
			setMarkers([...markers, new mapboxgl.Marker({color: 'green', scale: allSuggestions[i].upvotes})
			.setLngLat([allSuggestions[i].long, allSuggestions[i].lat])
			.addTo(map.current)
			.getElement().addEventListener('click', () => {
				console.log(allSuggestions[i].id);
			  })
			])
		}
	}

	useEffect(() => {
		updateMarkers();
	}, [allSuggestions])

	// On mount, query database for all the existing entries. 
	useEffect(() => {
		updateSuggestions();
	}, [], );

	// On post, requry data base for new nodes. 
	useEffect(() => {
		updateSuggestions();
	}, [suggestionsPosted])

	useEffect(() => {
		console.log(suggestionsPosted);
	}, [suggestionsPosted])

	function getAddress() {
		return address;
	}


	async function updateAddress()
	{	
		if (pinLng && pinLat) {
			var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + String(pinLng) + "," + String(pinLat) + ".json?access_token=" + mapboxgl.accessToken;
			const response = await axios.get(url);
			return response.data.features[0].place_name;
		} else {
			return;
		}
	}

	function setFormData(image, description, caption) {
		formData.image = image;
		formData.caption = caption; 
		formData.description = description;
		axios.post(backend_url+ '/create?', null, {params: {
			userID: userId, 
			upvotes: 1, 
			caption: caption, 
			desc: description, 
			lat: pinLat,
			long: pinLng, 
			img: image, 
		}}).then((resp) => setSuggestionsPosted([...suggestionsPosted, resp.data.id]))
	}

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom
			});
		});
	
	useEffect(()=>{
		if(activatedSearchBar.current) return;
		activatedSearchBar.current = true;
		map.current.addControl(
			new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl,
			marker: false,
			placeholder: 'Search for location'
			})
		);
	});

	useEffect(() => {
		if(foundCurrentLocation.current) return;
		foundCurrentLocation.current = true;
		map.current.addControl(
			new mapboxgl.GeolocateControl({
			positionOptions: {
			enableHighAccuracy: true
			},
			// When active the map will receive updates to the device's location as it changes.
			trackUserLocation: true,
			// Draw an arrow next to the location dot to indicate which direction the device is heading.
			showUserHeading: true
			})
		);
		
	});

	useEffect(() => {
		if (!map.current) return; // wait for map to initialize
		map.current.on('move', () => {
		setLng(map.current.getCenter().lng.toFixed(4));
		setLat(map.current.getCenter().lat.toFixed(4));
		setZoom(map.current.getZoom().toFixed(2));
		});
	});

	function getCoordinates()
	{
		return {pinLat: pinLat, pinLng: pinLng}
	}

	function mapClickFn(coordinates)
	{
		if(coordinates.lng !== pinLng || coordinates.lat !== pinLat) {
			// Update state of current click. 
			pinLng = coordinates.lng;
			pinLat = coordinates.lat;
			updateAddress()
			.then((resp) => {setAddress(resp)});
			// setSearchBar(geocoder.query(String(pinLat) + String(pinLng)));
			if(marker){
				marker = marker.remove()
			}
			marker = new mapboxgl.Marker()
			.setLngLat([pinLng, pinLat])
			.addTo(map.current);
		}
	}
	useEffect(() => {
		if (!map.current) return; 
		map.current.on("click", (e) => {
			mapClickFn(e.lngLat);
		});
	})
	
	return (
		<div>
		<div ref={mapContainer} className="map-container" />
		<AddButton getPinCoordinates={getCoordinates} setFormData={setFormData} getAddress={getAddress}/>
		</div>
		);

}

