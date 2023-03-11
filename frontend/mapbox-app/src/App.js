import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import AddButton from './AddButton';
import { MAPBOXKEY } from '../../keys';

// TODO: Move this to .env file. 
mapboxgl.accessToken = MAPBOXKEY;

export default function App() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	// TODO: Move these configs to some other file. 
	const [lng, setLng] = useState(-75.158924);
	const [lat, setLat] = useState(39.9629223);
	const [zoom, setZoom] = useState(11);

	var pinLng;
	var pinLat;
	var marker;

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom
			});
		});

	useEffect(() => {
		if (!map.current) return; // wait for map to initialize
		map.current.on('move', () => {
		setLng(map.current.getCenter().lng.toFixed(4));
		setLat(map.current.getCenter().lat.toFixed(4));
		setZoom(map.current.getZoom().toFixed(2));
		});
	});

	function mapClickFn(coordinates)
	{
		if(coordinates.lng !== pinLng || coordinates.lat !== pinLat) {
			// Update state of current click. 
			pinLng = coordinates.lng;
			pinLat = coordinates.lat;
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
		<div className="sidebar">
		Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
		</div>
		<div ref={mapContainer} className="map-container" />
		<AddButton/>
		</div>
		);


}

