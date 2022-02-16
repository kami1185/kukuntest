document.addEventListener("DOMContentLoaded", function() {

    
    //accedo con mi token a mapbox
	mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtaTExODUiLCJhIjoiY2t6bjc4dXB2NW1xajJ2cGhjYnBxZHI2bSJ9.qrCoJGjLQFWm_2AJK-6AwA';
    //mapboxgl.workerUrl = "https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl-csp-worker.js";
    const map = new mapboxgl.Map({
        container: 'map-us', // id del container
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: [-98, 38.88], // posicion del mapa dentro el iframe
        minZoom: 3,

        zoom: 2 // starting zoom
    });
	
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "popup-map"
    });

    let hoveredStateId = null;

    map.on('load', function() {
        // Add the source to query. In this example we're using
        // county polygons uploaded as vector tiles
        map.addSource('usa', {
            'type': 'geojson',
            'data': 'map/us.geojson',//load the json file in the path: /map/us.geojson
            'generateId': true
        });

    
        // map.addLayer({
            
        //     'id': 'states',
        //     'type': 'fill',
        //     'source': 'usa',
        //     'paint': {
        //         //'fill-color': '#627BC1',
        //         'fill-color': [
        //             'interpolate',
        //             ['linear'],
        //             ['get', 'costo'],
        //             0,
        //             '#F2F12D',
        //             100000,
        //             '#EED322',
        //             150000,
        //             '#E6B71E',
        //             200000,
        //             '#DA9C20',
        //             250000,
        //             '#CA8323',
        //             300000,
        //             '#B86B25',
        //             350000,
        //             '#A25626',
        //             400000,
        //             '#8B4225',
        //             450000,
        //             '#723122',
        //             500000,
        //             '#f76918',
        //             550000,
        //             '#f73918',
        //             600000,
        //             '#f71818'
        //             ],
        //         'fill-opacity': [
        //             'case',
        //             ['boolean', ['feature-state', 'hover'], false],
        //             1.3,
        //             0.82
        //         ]
        //     }
        // }); 

        // le doy un borde al mapa 
        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'usa',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 1.2
            }
        });

        //heatmap
        map.addLayer(
            {
              id: 'trees-heat',
              type: 'heatmap',
              source: 'usa',
              maxzoom: 15,
              paint: {
                // increase weight as diameter breast height increases
                'heatmap-weight': {
                  property: 'costo',
                  type: 'exponential',
                  stops: [
                    [1, 0],
                    [62, 1]
                  ]
                },
                // increase intensity as zoom level increases
                'heatmap-intensity': {
                  stops: [
                    [11, 1],
                    [15, 3]
                  ]
                },
                // assign color values be applied to points depending on their density
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(236,222,239,0)',
                  0.2,
                  'rgb(208,209,230)',
                  0.4,
                  'rgb(166,189,219)',
                  0.6,
                  'rgb(103,169,207)',
                  0.8,
                  'rgb(61, 187, 196)'
                //   'rgb(28,144,153)'
                ],
                // increase radius as zoom increases
                'heatmap-radius': {
                  stops: [
                    [11, 15],
                    [15, 20]
                  ]
                },
                // decrease opacity to transition into the circle layer
                'heatmap-opacity': {
                  default: 1,
                  stops: [
                    [14, 1],
                    [15, 0]
                  ]
                }
              }
            },
            'waterway-label'
        );

        map.addLayer(
            {
              id: 'trees-point',
              type: 'circle',
              source: 'usa',
              minzoom: 14,
              paint: {
                // increase the radius of the circle as the zoom level and dbh value increases
                'circle-radius': {
                  property: 'costo',
                  type: 'exponential',
                  stops: [
                    [{ zoom: 15, value: 1 }, 5],
                    [{ zoom: 15, value: 62 }, 10],
                    [{ zoom: 22, value: 1 }, 20],
                    [{ zoom: 22, value: 62 }, 50]
                  ]
                },
                'circle-color': {
                  property: 'costo',
                  type: 'exponential',
                  stops: [
                    [0, 'rgba(236,222,239,0)'],
                    [1, 'rgb(236,222,239)'],
                    [2, 'rgb(208,209,230)'],
                    [3, 'rgb(166,189,219)'],
                    [4, 'rgb(103,169,207)'],
                    [5, 'rgb(61, 187, 196)'],
                    // [5, 'rgb(28,144,153)'],
                    [6, 'rgb(1,108,89)']
                  ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                  stops: [
                    [14, 0],
                    [15, 1]
                  ]
                }
              }
            },
            'waterway-label'
        );
        //-------------------------------------------------------------------------------
        
    
        //event hover cuando paso el mouse sobre un state
        map.on('mousemove', 'states', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
    
            // tomo los datos de cada state 
            var feature = e.features[0];
    
            // creo la popup con el contenido html 
            // tomando los datos del file json en feature.properties
            popup.setLngLat(e.lngLat)//set de las coordenadas longitud y latitud para ubicar la popup
                .setHTML(setPopupHtml(feature.properties))//envio los datos del file json para crear la popup
                .addTo(map);

            // retoma el color inicial cuando paso el mouse 
            // a otro estado con true
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    map.setFeatureState(
                        { source: 'usa', id: hoveredStateId },
                        { hover: false }
                    );
                }
                    hoveredStateId = e.features[0].id;
                    map.setFeatureState(
                        { source: 'usa', id: hoveredStateId },
                        { hover: true }
                );
            }

        });
    
        //event cuando paso a otro state
        map.on('mouseleave', 'states', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();

            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'usa', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
        });

        map.on('click', 'trees-point', (e) => {
            
            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Cost:</strong> ${e.features[0].properties.costo}`)
            .addTo(map);
        });
    });


    //creo la popup con elementos html
    function setPopupHtml(data){
		console.log(data.name)
        // <a href="${data.wikipedia}" target="_blank"></a>
        //modifico los elementos con css
        return `<strong style="color:#0529ca; font-size: 1.2em">${data.name}</strong>
                <p style="color:#19181b; font-size: 1.25em">Approximate cost: $ <span style="color:#0529ca">${data.costo}</span></p>`
	}

    
});